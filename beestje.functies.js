/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('verzamel.beestje');
 * mod.thing == 'a thing'; // true
 */
 
// Game.creeps['jo9'].role = 'scout';

var helper = require('helper.functies');


var self = module.exports = {
    
    giveMemories: function(creepName, creepRole, targetID) { // for brainwashing if necessary
        // ---------------------
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        // ---------------------
        brain.role = creepRole;
        brain.target = targetID;
    },
    
    goWork: function(creepName){
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        if(!brain.target){brain.target = helper.getNextTarget(creepName)};
        // ---------------------------
        if(brain.role == "harvester"){
            self.goCollect(creepName);
        }else if(brain.role == "upgrader"){
            self.goUpgrade(creepName);
        }else if(brain.role == 'scout'){
            self.goScout(creepName);
        }else if(brain.role == 'builder'){
            self.goBuild(creepName);
        }else if(brain.role == 'repairman'){
            self.goFix(creepName);
        }
    },
    
    goCollect: function(creepName) {
        let creep = Game.creeps[creepName];
        var brain = creep.memory;
        //----------------------
        if(!brain.harvesting && creep.carry.energy == 0) {
            brain.harvesting = true;
            brain.target = helper.getNextTarget(creepName);
            creep.say('🐤 harvest');
        }
        if(brain.harvesting && creep.carry.energy == creep.carryCapacity) { 
            brain.harvesting = false;
            brain.target = null;
            creep.say('🐤 deposit');
        }
        if(brain.harvesting == true){
            var target = Game.getObjectById(brain.target);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                // get least populated energy source
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }  
        } else { // go deposit
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },

    goUpgrade: function(creepName){
        let creep = Game.creeps[creepName];
        var sources = creep.room.find(FIND_SOURCES);
        let brain = creep.memory;
        // ---------------------
        if(brain.upgrading && creep.carry.energy == 0) {
            brain.upgrading = false;
            brain.target = helper.getNextTarget(creepName);
            creep.say('🌸 harvest');
        }
        if(!brain.upgrading && creep.carry.energy == creep.carryCapacity) { 
            brain.upgrading = true;
            brain.target = null;
            creep.say('🌸 upgrade');

        }
        if(brain.upgrading == true){
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller,  {visualizePathStyle: {stroke: '#FFC0CB'}});
            }else{
            }
        }else{
            target = Game.getObjectById(brain.target);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }, 
    goScout: function(creepName){
        let creep = Game.creeps[creepName];
        var exits = Game.map.describeExits(creep.room.name);
        var route = Game.map.findRoute(creep.room.name, exits[3]); //right room
        if(route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        } 
    },
    goBuild: function(creepName) {
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        if(brain.building && creep.carry.energy == 0) {
            brain.building = false;
            brain.target = helper.getNextTarget(creepName);
            creep.say('🚧 harvest');
        }
        if(!brain.building && creep.carry.energy == creep.carryCapacity) {
            brain.building = true;
            brain.target = null;
            creep.say('🚧 build');
        }

        if(brain.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            target = Game.getObjectById(brain.target);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    },
    goFix: function(creepName) {
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        if(brain.repairing && creep.carry.energy == 0) {
            brain.repairing = false;
            brain.target = helper.getNextTarget(creepName);
            creep.say('👌 harvest');
        }
        if(!brain.repairing && creep.carry.energy == creep.carryCapacity) {
            brain.repairing = true;
            brain.target = null;
            creep.say('👌 repair');
        }

        if(brain.repairing) {
            // find all walls in the room
            var percentage = 0.0003;
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => s.structureType == STRUCTURE_WALL &&
                            s.hits / s.hitsMax < percentage
                        });
            if (!target == 0) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else{ // buildy
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        else {
            target = Game.getObjectById(brain.target);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }

}


