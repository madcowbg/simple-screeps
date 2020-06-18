'use strict';

if (Memory.buildVersion === undefined) {
    Memory.buildVersion = 0;
} else {
    Memory.buildVersion += 1;
}

module.exports.loop = () => {
    console.log("build version: " + Memory.buildVersion)

    for (let spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        spawn.createCreep([WORK, WORK, CARRY, MOVE]);
    }

    for (let creepName in Game.creeps) {
        const creep = Game.creeps[creepName];

        creep.say(creep.carry.energy)
        if (creep.carry.energy === 0) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            creep.moveTo(src);
            creep.harvest(src);

        } else if (creep.carry.energy < creep.carryCapacity) {
            const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if (creep.pos.getRangeTo(src) <= 1) {
                creep.harvest(src)
            } else {
                const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                creep.moveTo(spawn);
                creep.transfer(spawn, RESOURCE_ENERGY)
            }
        } else {
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            creep.moveTo(spawn);
            creep.transfer(spawn, RESOURCE_ENERGY);
        }
    }
}
