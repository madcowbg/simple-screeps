'use strict';
var roles = require('./role');

/*
    for (let c in Game.creeps) {
        Game.creeps[c].suicide()
    }

    for (let creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.role === undefined) {
            creep.memory.role = roles.CREEP_ROLE.Supplier
        }
    }
 */

if (Memory.buildVersion === undefined) {
    Memory.buildVersion = 0;
} else {
    Memory.buildVersion += 1;
}

function defineCachedProperty(object, propertyName, f) {
    Object.defineProperty(object, propertyName, {
        get: function () {
            Object.defineProperty(this, propertyName, {value: f(this) })
            return this[propertyName];
        }
    });
}

defineCachedProperty(Room.prototype, 'creepsByRole', (room) => _.groupBy(room.find(FIND_MY_CREEPS), (c) => c.memory.role))

module.exports.loop = () => {
    console.log("build version: " + Memory.buildVersion)

    for (let spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        for (let role in roles.CREEP_MIN_COUNTS) {
            const actualLength = _.size(spawn.room.creepsByRole[role]);
            if (actualLength < roles.CREEP_MIN_COUNTS[role]) {
                spawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: role});
            } else {
                console.log(`got enough of ${role}: ${roles.CREEP_MIN_COUNTS[role]} < ${actualLength}!`);
            }
        }
    }

    for (let creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const creepFun = roles.CREEP_ROLE_FUNCS[creep.memory.role];
        if (creepFun) { // fixme no check...
            creepFun(creep);
        } else {
            console.log(`undefined fun for ${creep.name} of role ${creep.memory.role}!`)
            creep.say("bad role!")
        }
    }
}
