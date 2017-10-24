/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

var self = module.exports = {
    jobs: {scout:{
            priority: false,
            jobTitle: 'scout',
            jobCount: 0,
            jobBody: [MOVE]
            },
            harvester:{
             priority: true,
             jobTitle: 'harvester',
             jobCount: 5,
             jobBody: [WORK, WORK, CARRY, MOVE]
            },
            gatherer:{
             priority: false,
             jobTitle: 'gatherer',
             jobCount: 10,
             jobBody: [CARRY, CARRY, CARRY, CARRY, MOVE]
            },
            upgrader:{
             priority: false,
             jobTitle: 'upgrader',
             jobCount: 20,
             jobBody: [WORK, CARRY, CARRY, CARRY, MOVE] 
            },
            builder:{
             priority: false,
             jobTitle: 'builder',
             jobCount: 20,
             jobBody: [WORK, CARRY, CARRY, CARRY, MOVE] 
            },
            repairman:{
             priority: false,
             jobTitle: 'repairman',
             jobCount: 15,
             jobBody: [WORK, CARRY, CARRY, CARRY, MOVE]   
            }
    }
};