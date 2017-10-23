/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.functies');
 * mod.thing == 'a thing'; // true
 */
 
var jobs = {scout:{
            jobTitle: 'scout',
            jobCount: 0,
            jobBody: [MOVE]
            },
            harvester:{
             jobTitle: 'harvester',
             jobCount: 30,
             jobBody: [WORK, WORK, CARRY, MOVE]
            },
            upgrader:{
             jobTitle: 'upgrader',
             jobCount: 10,
             jobBody: [WORK, WORK, CARRY, MOVE] 
            },
            builder:{
             jobTitle: 'builder',
             jobCount: 10,
             jobBody: [WORK, WORK, CARRY, MOVE] 
            },
            repairman:{
             jobTitle: 'repairman',
             jobCount: 10,
             jobBody: [WORK, CARRY, MOVE]   
            }
};

var self = module.exports = {
    makeName: function() {
        name = Math.random().toString(36).substring(2,5);  
        return name;
    },
    countBugs: function(){
        var total = 0, alive = 0;
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep.my) {
                return;
            }
            total++;
            alive += (creep.hits > 0) ? 1 : 0;
        }
        return(alive)
    },
    killAll: function(){
        for(let creepName in Game.creeps){
            let creep = Game.creeps[creepName];
            creep.suicide()
        }
    },
    getRooms: function(){
        let scoutCount = _(Game.creeps).filter( { memory:{ role: 'scout' }}).size();
        let scouts = _(Game.creeps).filter( { memory:{ role: 'scout' }}).value();
        let roomz = [Game.spawns['FirstSpawn'].room.name];
        // -----------------------------
        if(scoutCount == 0){
        }else{
            scouts.forEach( function (scout){
                let rooom = scout.room.name;
                roomz += rooom;
            })
        }
        // ----------
        if(roomz.length == 1){
            var exits = Game.map.describeExits(Game.spawns['FirstSpawn'].room.name);
            for(key in exits){
                rooom = exits[key];
                roomz.push(rooom);
            }
        }
        return(roomz)
    },
    getSources: function(rooom){
        // need a scout in room OR spawn
        let scoutsObj = _(Game.creeps).filter( { memory:{ role: 'scout', targetRoom: rooom }});
        let scouts = scoutsObj.value();
        let sources = [];
        // -------------------
        if(scoutsObj.size() == 0) { return(0) } else{ // RETURN NULL
            scouts.forEach( function (scout){
                let sources = scout.room.name;
                roomz += rooom;})
            sources.filter( onlyUnique );
        } 
    },
    getHighestSource: function(creep){
        var target = creep.room.find(FIND_SOURCES);
        // ---------------------------------------
        if ( target.length ) {
            var allSource = [];
            // Calculate the percentage of energy in each container.
            for ( var i = 0; i < target.length; i++ ) {
                allSource.push( { energyPercent: ( ( target[i].energy / target[i].energyCapacity ) * 100 ), id: target[i].id } );
        }
        // Get the container containing the most energy.
        var ID = _.max( allSource, function( source ){ return source.energyPercent; }).id;
        }
        return(ID)
    },
    getNextJob: function(){
        var allJobs = [];
        // Calculate the percentage of energy in each container.
        for ( i in jobs ) {
            var employed = _(Game.creeps).filter( { memory:{ role: jobs[i].jobTitle }}).size();
            allJobs.push( { employedPercent: ( ( employed / jobs[i].jobCount ) * 100 ), name: jobs[i].jobTitle } );
        }
        var nextJob = _.min( allJobs, function( job ){ return job.employedPercent; }).name;
        return(nextJob);
    },
    getNextTarget: function(creepName){
        var creep = Game.creeps[creepName];
        console.log(creepName);
        //if(!creep){return(null)};
        var targets = creep.room.find(FIND_SOURCES);
        var allTargets = [];
        // Calculate the percentage of energy in each container.
        for ( i in targets ) {
            var targetID = targets[i].id;
            var targeted = _(Game.creeps).filter( { memory:{ target: targetID, role: creep.memory.role }}).size();
            // ------------
            if(targeted > 0){
                allTargets.push({targetedPercent: ( ( targeted / jobs[creep.memory.role].jobCount ) * 100 ), name: targetID});
            } else{
                allTargets.push({targetedPercent: 0, name: targetID});
            }
        }
        var nextTarget = _.min( allTargets, function( t ){ return t.targetedPercent; } ).name;
        return(nextTarget);
    },
    getBodyCost: function(body){
        var _ = require("lodash");
        var bodyCost = {
          "move": 50,
          "carry": 50,
          "work": 20,
          "heal": 200,
          "tough": 20,
          "attack": 80,
          "ranged_attack": 150
        };
        var cost = 0;
        _.forEach(body, function(part) { cost += bodyCost[part]; });
        // ----------
        return(cost);
    }
}

