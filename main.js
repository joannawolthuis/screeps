var core = require('beestje.functies');
var helper = require('helper.functies');
var settings = require('constants');
// ---------------------------------
var currSpawn = 'FirstSpawn';
var currRoom =  Game.spawns[currSpawn].room.name;
// =================================
var fertile = true;
var go = true;
var explore = true;

var jobs = settings.jobs;


module.exports.loop = function () {
    
    // -----------

    if(go == true){
        
        //Game.creeps['k9i'].memory.target = helper.getNextTarget('k9i', "source");
        
        // Send creeps to do work
        
        for(let creepName in Game.creeps) {
            core.goWork(creepName);
        }

        // Spawn babies <3 
        let spawnObj = Game.spawns[currSpawn];
            
        if(fertile == true && !spawnObj.spawning){
            let currCreeps = helper.countBugs();
            let sources = Game.spawns[currSpawn].room.find(FIND_SOURCES);
            var jobTitle = helper.getNextJob(jobs);
            var job = jobs[jobTitle];
            var neededEnergy = helper.getBodyCost(job.jobBody);
            console.log(neededEnergy);
            console.log("gonna make " + job.jobTitle);
            // ----------------------------------------------------------
            if(spawnObj.energy >= neededEnergy){
                // name the babby
                let creepName = helper.makeName();
                // ---------------------
                spawnObj.createCreep(job.jobBody, creepName, {role: job.jobTitle, target: sources[0].id});
            } 
        }
        
        var tower = Game.getObjectById('TOWER_ID');
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}

