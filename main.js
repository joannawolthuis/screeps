var core = require('beestje.functies');
var helper = require('helper.functies');
// ---------------------------------
var currSpawn = 'FirstSpawn';
var currRoom =  Game.spawns[currSpawn].room.name;
// ---------------------------------

var jobs = [{
            jobTitle: 'scout',
            jobCount: 0,
            jobBody: [MOVE]
            },
            {
             jobTitle: 'harvester',
             jobCount: 12,
             jobBody: [WORK, WORK, CARRY, MOVE]
            },{
             jobTitle: 'upgrader',
             jobCount: 12,
             jobBody: [WORK, WORK, CARRY, MOVE] 
            },
            {
             jobTitle: 'builder',
             jobCount: 20,
             jobBody: [WORK, WORK, CARRY, MOVE] 
            }];
            
// =================================
var fertile = true;
var go = true;
var explore = true;

module.exports.loop = function () {
    
    // -----------

    if(go == true){
        
        // Send creeps to do work
        
        for(let creepIndex in Game.creeps) {
            core.goWork(creepIndex);
        }

        // Spawn babies <3 
        let spawnObj = Game.spawns[currSpawn];
            
        if(fertile == true && !spawnObj.spawning){
            let currCreeps = helper.countBugs();
            let sources = Game.spawns[currSpawn].room.find(FIND_SOURCES);
            // ----------------------------------------------------------
            if(spawnObj.energy == 300){
                // name the babby
                let creepName = helper.makeName();
                // ----------------------
                jobs.forEach( function (job){
                    let withRole =  _(Game.creeps).filter( { memory:{ role: job.jobTitle } } ).size();
                    if(withRole < job.jobCount){
                        // ---------------------
                        for(let i in sources){
                            let locals = _(Game.creeps).filter( { memory:{ role: job.jobTitle, target: sources[i].id } } ).size();
                            if(locals < job.jobCount / 2){
                                console.log("gonna make " + job.jobTitle);
                                spawnObj.createCreep(job.jobBody, creepName, {role: job.jobTitle, target: sources[i].id});
                            }
                        }
                    }
                })
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

