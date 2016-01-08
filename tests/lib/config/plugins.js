/**
 * @fileoverview Tests for Plugins
 * @author Nicholas C. Zakas
 * @copyright 2016 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    proxyquire = require("proxyquire");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

proxyquire = proxyquire.noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Environments", function() {

    describe("load()", function() {

        var StubbedPlugins,
            Rules,
            Environments,
            plugin;

        beforeEach(function() {
            plugin = {};
            Environments = require("../../../lib/config/environments");
            Rules = require("../../../lib/rules");
            StubbedPlugins = proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example": plugin,
                "./environments": Environments,
                "../rules": Rules
            });
        });

        it("should load a plugin when referenced by short name", function() {
            StubbedPlugins.load("example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should load a plugin when referenced by long name", function() {
            StubbedPlugins.load("eslint-plugin-example");
            assert.equal(StubbedPlugins.get("example"), plugin);
        });

        it("should register environments when plugin has environments", function() {
            plugin.environments = {
                foo: {
                    globals: { foo: true }
                },
                bar: {
                    globals: { bar: false }
                }
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(Environments.get("example/foo"), plugin.environments.foo);
            assert.deepEqual(Environments.get("example/bar"), plugin.environments.bar);
        });

        it("should register rules when plugin has rules", function() {
            plugin.rules = {
                baz: {},
                qux: {}
            };

            StubbedPlugins.load("eslint-plugin-example");

            assert.deepEqual(Rules.get("example/baz"), plugin.rules.baz);
            assert.deepEqual(Rules.get("example/qux"), plugin.rules.qux);
        });

    });

    describe("loadAll()", function() {

        var StubbedPlugins,
            Rules,
            Environments,
            plugin1,
            plugin2;

        beforeEach(function() {
            plugin1 = {};
            plugin2 = {};
            Environments = require("../../../lib/config/environments");
            Rules = require("../../../lib/rules");
            StubbedPlugins = proxyquire("../../../lib/config/plugins", {
                "eslint-plugin-example1": plugin1,
                "eslint-plugin-example2": plugin2,
                "./environments": Environments,
                "../rules": Rules
            });
        });

        it("should load plugins when passed multiple plugins", function() {
            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(StubbedPlugins.get("example1"), plugin1);
            assert.equal(StubbedPlugins.get("example2"), plugin2);
        });

        it("should load environments from plugins when passed multiple plugins", function() {
            plugin1.environments = {
                foo: {}
            };

            plugin2.environments = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(Environments.get("example1/foo"), plugin1.environments.foo);
            assert.equal(Environments.get("example2/bar"), plugin2.environments.bar);
        });

        it("should load rules from plugins when passed multiple plugins", function() {
            plugin1.rules = {
                foo: {}
            };

            plugin2.rules = {
                bar: {}
            };

            StubbedPlugins.loadAll(["example1", "example2"]);
            assert.equal(Rules.get("example1/foo"), plugin1.rules.foo);
            assert.equal(Rules.get("example2/bar"), plugin2.rules.bar);
        });

    });



});
