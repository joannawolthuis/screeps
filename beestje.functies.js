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
        var brain = creep.memory;
        if(brain.role == "harvester"){
            self.goCollect(creep);
        }else if(brain.role == "upgrader"){
            self.goUpgrade(creep);
        }else if(brain.role == 'scout'){
            self.goScout(creep);
        }else if(brain.role == 'builder'){
            self.goBuild(creep);
        }
    },
    
    goCollect: function(creep) {
        var brain = creep.memory;
        //----------------------
        if(!brain.harvesting && creep.carry.energy == 0) {
            brain.harvesting = true;
            brain.target = helper.getHighestSource(creep);
            creep.say('🐤 harvest');
        }
        if(brain.harvesting && creep.carry.energy == creep.carryCapacity) { 
            brain.harvesting = false;
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

    goUpgrade: function(creep){
        var sources = creep.room.find(FIND_SOURCES);
        let brain = creep.memory;
        // ---------------------
        if(brain.upgrading && creep.carry.energy == 0) {
            brain.upgrading = false;
            brain.target = helper.getHighestSource(creep);
            creep.say('🌸 harvest');
        }
        if(!brain.upgrading && creep.carry.energy == creep.carryCapacity) { 
            brain.upgrading = true;
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
    goScout: function(creep){
        var exits = Game.map.describeExits(creep.room.name);
        var route = Game.map.findRoute(creep.room.name, exits[3]); //right room
        if(route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        } 
    },
    goBuild: function(creep) {
        let brain = creep.memory;

        if(brain.building && creep.carry.energy == 0) {
            brain.building = false;
            brain.target = helper.getHighestSource(creep);
            creep.say('🚧 harvest');
        }
        if(!brain.building && creep.carry.energy == creep.carryCapacity) {
            brain.building = true;
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
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}


