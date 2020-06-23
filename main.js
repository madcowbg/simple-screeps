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

Creep.prototype.loop = function() {
    const creepFun = roles.CREEP_ROLE_FUNCS[this.memory.role];
    if (creepFun) { // fixme no check...
        creepFun(this);
    } else {
        console.log(`undefined fun for ${this.name} of role ${this.memory.role}!`)
        this.say("bad role!")
    }
}

Spawn.prototype.loop = function() {
    for (let role in roles.CREEP_MIN_COUNTS) {
        const actualLength = _.size(this.room.creepsByRole[role]);
        if (actualLength < roles.CREEP_MIN_COUNTS[role]) {
            this.createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: role});
        } else {
            console.log(`got enough of ${role}: ${roles.CREEP_MIN_COUNTS[role]} < ${actualLength}!`);
        }
    }
}

module.exports.loop = () => {
    console.log("build version: " + Memory.buildVersion)

    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].loop();
    }

    for (let creepName in Game.creeps) {
        Game.creeps[creepName].loop();
    }
}
