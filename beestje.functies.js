/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('verzamel.beestje');
 * mod.thing == 'a thing'; // true
 */
 
var helper = require('helper.functies');
var settings = require('constants');

var self = module.exports = {
    
    giveMemories: function(creepName, creepRole) { // for brainwashing if necessary
        // ---------------------
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        // ---------------------
        brain.role = creepRole;
    },
    
    goWork: function(creepName){
        let creep = Game.creeps[creepName];
        let brain = creep.memory;
        // ---------------------------
        if(brain.role == "harvester"){
            //brain.target = helper.getNextTarget(creepName, "source");
            self.goHarvest(creepName);
        }else if(brain.role == "gatherer"){
            self.goGather(creepName);
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
    goHarvest: function(creepName){
        let creep = Game.creeps[creepName];
        var brain = creep.memory;
        var target = Game.getObjectById(brain.target);
        if(!brain.target){brain.target = helper.getNextTarget(creepName, "source");};
        // --------------------------------------
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            // get least populated energy source
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }else if(creep.harvest(target) == ERR_NOT_ENOUGH_RESOURCES){
            brain.target = helper.getNextTarget(creepName, "source");
        }else{
            brain.harvesting = true;
        }
    },
    goGather: function(creepName) {
        let creep = Game.creeps[creepName];
        var brain = creep.memory;
        //----------------------
        if(!brain.gathering && creep.carry.energy == 0) {
            brain.gathering = true;
            brain.target = helper.getNextTarget(creepName);
            creep.say('🐤 gather');
        }else if(brain.gathering && creep.carry.energy == creep.carryCapacity) { 
            brain.gathering = false;
            brain.target = helper.getNextTarget(creepName, "storage");
            creep.say('🐤 deposit');
        }
        if(brain.gathering == true){
            ///////////////////////////////////////////
            var target = Game.getObjectById(brain.target);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }else if(creep.pickup(target) == ERR_INVALID_TARGET){
                brain.target = helper.getNextTarget(creepName);
            }
        } else { // go deposit
            if(creep.transfer(Game.spawns['FirstSpawn'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['FirstSpawn'], {visualizePathStyle: {stroke: '#ffffff'}});
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
            var target = Game.getObjectById(brain.target);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }else if(creep.pickup(target) == ERR_INVALID_TARGET){
                brain.target = helper.getNextTarget(creepName);
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
            var target = Game.getObjectById(brain.target);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }else if(creep.pickup(target) == ERR_INVALID_TARGET){
                brain.target = helper.getNextTarget(creepName);
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
            var target = Game.getObjectById(brain.target);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }else if(creep.pickup(target) == ERR_INVALID_TARGET){
                brain.target = helper.getNextTarget(creepName);
            }
        }
    }

}


