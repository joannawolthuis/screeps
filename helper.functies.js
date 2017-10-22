/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.functies');
 * mod.thing == 'a thing'; // true
 */

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
    }
}

