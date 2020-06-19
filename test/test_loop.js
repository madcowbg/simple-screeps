const chai = require('chai')
const expect = chai.expect

var _ = require('lodash');

global.Memory = {};

var main = require('../main');

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