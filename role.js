
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

module.exports.CREEP_ROLE = CREEP_ROLE;
module.exports.CREEP_MIN_COUNTS = CREEP_MIN_COUNTS;
module.exports.CREEP_ROLE_FUNCS = CREEP_ROLE_FUNCS;
