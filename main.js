'use strict';

/*
for (let c in Game.creeps) {
    Game.creeps[c].suicide()
}
 */

if (Memory.buildVersion === undefined) {
    Memory.buildVersion = 0;
} else {
    Memory.buildVersion += 1;
}

const CREEP_ROLE = Object.freeze({
    Supplier: "supplier",
    Upgrader: "upgrader"
})

const CREEP_MIN_COUNTS = Object.freeze({
    "supplier": 10,
    "upgrader": 1
})

function satisfySpawnOrUpdate(creep) {
    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    if (spawn.store.energy < spawn.store.energyCapacity) {
        creep.moveTo(spawn);
        creep.transfer(spawn, RESOURCE_ENERGY);
    } else {
        creep.moveTo(creep.room.controller);
        creep.upgradeController(creep.room.controller);
    }
}

const CREEP_ROLE_FUNCS = Object.freeze({
    "supplier": (creep) => {
        if (creep.carry.energy === 0) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            creep.moveTo(src);
            creep.harvest(src);
        } else if (creep.carry.energy < creep.carryCapacity) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if (creep.pos.getRangeTo(src) <= 1) {
                creep.harvest(src)
            } else {
                satisfySpawnOrUpdate(creep);
            }
        } else {
            satisfySpawnOrUpdate(creep);
        }
    },
    "upgrader": (creep) => {
        if (creep.carry.energy === 0) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            creep.moveTo(src);
            creep.harvest(src);
        } else if (creep.carry.energy < creep.carryCapacity) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if (creep.pos.getRangeTo(src) <= 1) {
                creep.harvest(src)
            } else {
                creep.moveTo(creep.room.controller);
                creep.upgradeController(creep.room.controller);
            }
        } else {
            creep.moveTo(creep.room.controller);
            creep.upgradeController(creep.room.controller);
        }
    }
})

module.exports.loop = () => {
    console.log("build version: " + Memory.buildVersion)

    var creepsByRole = _.groupBy(_.values(Game.creeps), (c) => c.memory.role)

    for (let spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        for (let role in CREEP_MIN_COUNTS) {
            const actualLength = _.size(creepsByRole[role]);
            if (actualLength < CREEP_MIN_COUNTS[role]) {
                spawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: role});
            } else {
                console.log(`got enough of ${role}: ${CREEP_MIN_COUNTS[role]} < ${actualLength}!`);
            }
        }

    }

    for (let creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.role === undefined) {
            creep.memory.role = CREEP_ROLE.Supplier
        }
    }

    for (let creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        const creepFun = CREEP_ROLE_FUNCS[creep.memory.role];
        if (creepFun) { // fixme no check...
            creepFun(creep);
        } else {
            console.log(`undefined fun for ${creep.name} of role ${creep.memory.role}!`)
            creep.say("bad role!")
        }
    }
}
