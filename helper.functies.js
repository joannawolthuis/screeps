/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.functies');
 * mod.thing == 'a thing'; // true
 */

var settings = require('constants');
var jobs = settings.jobs;

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
            /////////////////////////////
            if(jobs[i].priority == true && employed < jobs[i].jobCount){
                return(jobs[i].jobTitle);
            }else{
                allJobs.push( { employedPercent: ( ( employed / jobs[i].jobCount ) * 100 ), name: jobs[i].jobTitle } );
            }
        }
        var nextJob = _.min( allJobs, function( job ){ return job.employedPercent; }).name;
        return(nextJob);
    },
    getNextTarget: function(creepName, type="energy"){
        var creep = Game.creeps[creepName];
        var allTargets = [];
        /////////////////////
        if(type == "energy"){
            var targets = creep.room.find(FIND_DROPPED_RESOURCES);
            for ( i in targets ) {
                var targetID = targets[i].id;
                var energyCount = targets[i].amount;
                allTargets.push({energy: energyCount, id:targetID})
                // --- get one with most energy ---
                var nextTarget = _.max( allTargets, function( t ){ return t.energy; } ).id;
            }
        }else if(type == 'source'){
            var targets = creep.room.find(FIND_SOURCES);
            for ( i in targets ) {
                var targetID = targets[i].id;
                var pos = targets[i].pos;
                var targeted = _(Game.creeps).filter( { memory:{ target: targetID, role: creep.memory.role }}).size();
            // ------------
                let area = targets[i].room.lookForAtArea(LOOK_TERRAIN, targets[i].pos.y - 1, targets[i].pos.x - 1, targets[i].pos.y + 1, targets[i].pos.x + 1, true);
                i=0;
                for (let block of area) {
                    if (block.terrain == 'wall') {
                        i++;
                    }
                }
                var free = 9-i;
                allTargets.push({free: ( free - targeted ), name: targetID});
            }
        
            var nextTarget = _.max( allTargets, function( t ){ return t.free; } ).name;
            console.log(nextTarget);
        }else if(type == 'storage'){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy <= structure.energyCapacity;
                }
            });
            var nextTarget = targets[0];
        }
        return(nextTarget);
    },
/*
Body part	Build cost	Effect
MOVE	50	Moves the creep. Reduces creep fatigue by 2/tick. See movement.
WORK	100	Harvests energy from target source. Gathers 2 energy/tick.
Constructs a target structure. Builds the designated structure at a construction site, at 5 points/tick, consuming 1 energy/point. See building Costs.
Repairs a target structure. Repairs a structure for 20 hits/tick. Consumes 0.1 energy/hit repaired, rounded up to the nearest whole number.
CARRY	50	Stores energy. Contains up to 50 energy units. Weighs nothing when empty.
ATTACK	80	Attacks a target creep/structure. Deals 30 damage/tick. Short-ranged attack (1 tile).
RANGED_ATTACK	150	Attacks a target creep/structure. Deals 10 damage/tick. Long-ranged attack (1 to 3 tiles).
HEAL	250	Heals a target creep. Restores 12 hit points/tick at short range (1 tile) or 4 hits/tick at a distance (up to 3 tiles).
TOUGH	10	No effect other than the 100 hit points all body parts add. This provides a cheap way to add hit points to a creep.
CLAIM	600	
*/
    getBodyCost: function(body){
        var _ = require("lodash");
        var bodyCost = {
          "move": 50,
          "carry": 50,
          "work": 100,
          "heal": 250,
          "tough": 10,
          "claim":600,
          "attack": 80,
          "ranged_attack": 150
        };
        var cost = 0;
        _.forEach(body, function(part) { cost += bodyCost[part]; });
        // ----------
        return(cost);
    }
}

