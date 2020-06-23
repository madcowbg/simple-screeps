"use strict";

global.Memory = {};
function room_prototype() {}
global.Room = room_prototype;

function creep_prototype() {}
global.Creep = creep_prototype;

function spawn_prototype() {}
global.Spawn = spawn_prototype;


const chai = require('chai')
const expect = chai.expect

var _ = require('lodash');

var role = require('../role');

describe('CREEP_ROLE', () => {
    describe("CREEP_MIN_COUNTS", () => {
        it("should have values set equal to keys of CREEP_ROLE", () => {
            expect(_.values(role.CREEP_ROLE)).to.include.members(_.keys(role.CREEP_MIN_COUNTS));
        });
    });
    describe("CREEP_ROLE_FUNCS", () => {
        it("should have creep role func for all roles", () => {
            expect(_.keys(role.CREEP_ROLE_FUNCS)).to.have.members(_.values(role.CREEP_ROLE))
        });
        it("should have all values as funcs", () => {
            _.values(role.CREEP_ROLE_FUNCS).forEach(f => expect(f).to.be.a('function'));
        })
    })
})

const main = require('../main');

describe('main functionality', () => {
    it("should provide a version of 0", () => {
        expect(Memory.buildVersion).to.equal(0);
    })
})
