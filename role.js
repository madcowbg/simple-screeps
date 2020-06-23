const CREEP_ROLE = Object.freeze({
    Supplier: "supplier",
    Upgrader: "upgrader",
})

const CREEP_MIN_COUNTS = Object.freeze({
    "supplier": 10,
    "upgrader": 1,
})

function satisfySpawnOrUpdate(creep) {
    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    if (spawn.energy < spawn.energyCapacity) {
        if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
    } else {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

function harvestEnergy(creep) {
    const src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
    creep.moveTo(src);
    creep.harvest(src);
}

function updateState(creep) {
    if (!creep.memory.working) {
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }
    } else {
        if (creep.carry.energy === 0) {
            creep.memory.working = false;
        }
    }
}

const CREEP_ROLE_FUNCS = Object.freeze({
    "supplier": (creep) => {
        updateState(creep);

        creep.say(creep.memory.working);
        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            satisfySpawnOrUpdate(creep);
        }
    },
    "upgrader": (creep) => {
        updateState(creep);
        creep.say(creep.memory.working);

        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
})

module.exports.CREEP_ROLE = CREEP_ROLE;
module.exports.CREEP_MIN_COUNTS = CREEP_MIN_COUNTS;
module.exports.CREEP_ROLE_FUNCS = CREEP_ROLE_FUNCS;
