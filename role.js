
const CREEP_ROLE = Object.freeze({
    Supplier: "supplier",
    Upgrader: "upgrader",
    Builder: "builder",
    Repairer: "repairer"
})

const CREEP_MIN_COUNTS = Object.freeze({
    "supplier": 5,
    "upgrader": 1,
    "builder": 3,
    "repairer": 1
})


Creep.prototype.loop = function() {
    updateState(this);

    const creepFun = CREEP_ROLE_FUNCS[this.memory.role];
    if (creepFun) { // fixme no check...
        creepFun(this);
    } else {
        console.log(`undefined fun for ${this.name} of role ${this.memory.role}!`)
        this.say("bad role!")
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
        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if (spawn.energy < spawn.energyCapacity) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else {
                CREEP_ROLE_FUNCS[CREEP_ROLE.Upgrader](creep);
            }
        }
    },
    "upgrader": (creep) => {
        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    "builder": (creep) => {
        creep.say("builder");
        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (site != null) {
                if (creep.build(site) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
            } else {
                CREEP_ROLE_FUNCS[CREEP_ROLE.Supplier](creep);
            }
        }
    },
    "repairer": (creep) => {
        creep.say("repairer");
        if (!creep.memory.working) {
            harvestEnergy(creep);
        } else {
            const site = creep.pos.findClosestByPath(
                FIND_STRUCTURES, (s) => s.hits < 0.9 * s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART)
            if (site !== null) {
                if (creep.repair(site) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
            } else {
                CREEP_ROLE_FUNCS[CREEP_ROLE.Builder](creep)
            }
        }
    }
})

module.exports.CREEP_ROLE = CREEP_ROLE;
module.exports.CREEP_MIN_COUNTS = CREEP_MIN_COUNTS;
module.exports.CREEP_ROLE_FUNCS = CREEP_ROLE_FUNCS;
