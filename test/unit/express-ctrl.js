/*jshint es5:true, expr:true, maxlen:120, maxstatements:50, regexp:false */
/*global after, before, describe, it */
'use strict';

// Dependencies
var assert = require('chai').assert;
var mockery = require('mockery');
var sinon = require('sinon');
var spy = sinon.spy;
var stub = sinon.stub;

// Test subject
var ctrl = require('../..');

// Tests
describe('express-ctrl', function () {

    before(function () {
        mockery.enable();
    });

    after(function () {
        mockery.disable();
    });

    describe('#requireController(dir, name)', function () {
        var dir, name, controllerModule, controller;

        before(function () {
            dir = '/foo';
            name = 'bar';
            controllerModule = {};
            mockery.registerMock('/foo/bar', controllerModule);
            controller = ctrl.requireController(dir, name);
        });

        after(function () {
            mockery.deregisterMock('/foo/bar');
        });

        it('should return the expected controller', function () {
            assert.strictEqual(controller, controllerModule);
        });

        describe('when controller path does not exist', function () {

            before(function () {
                mockery.registerAllowable('/bar/baz');
            });

            after(function () {
                mockery.deregisterAllowable('/bar/baz');
            });

            it('should throw an error', function () {
                assert.throws(function () {
                    ctrl.requireController('/bar', 'baz');
                }, /controller.+bar\/baz.+could not be loaded/i);
            });

        });

    });

    describe('#addController(app, controller)', function () {
        var app, controller;

        before(function () {
            app = {all: spy()};
            controller = {
                route: 'foo/bar'
            };
            ctrl.addController(app, controller);
        });

        it('should add a route to the express app', function () {
            assert.isTrue(app.all.withArgs(controller.route).calledOnce);
            assert.strictEqual(app.all.firstCall.args[0], controller.route);
            assert.isFunction(app.all.firstCall.args[1]);
        });

        describe('route(req, res, next)', function () {
            var route, req, res, next;

            before(function () {
                route = app.all.firstCall.args[1];
                controller.get = spy();
                req = {method: 'GET'};
                res = {};
                next = spy();
                route(req, res, next);
            });

            it('should call the expected controller action, passing on arguments', function () {
                assert.isTrue(controller.get.withArgs(req, res, next).calledOnce);
            });

            describe('when controller action does not exist', function () {

                before(function () {
                    req = {method: 'POST'};
                    next.reset();
                    route(req, res, next);
                });

                it('should call next', function () {
                    assert.isTrue(next.calledOnce);
                });

            });

            describe('when controller action is not a function', function () {

                before(function () {
                    req = {method: 'POST'};
                    controller.post = true;
                    next.reset();
                    route(req, res, next);
                });

                it('should call next', function () {
                    assert.isTrue(next.calledOnce);
                });

            });

        });

    });

    describe('#addController(app, controller, fallbackAction)', function () {
        var app, controller, fallbackAction;

        before(function () {
            app = {all: spy()};
            controller = {
                route: 'foo/bar'
            };
            fallbackAction = spy();
            ctrl.addController(app, controller, fallbackAction);
        });

        describe('route(req, res, next)', function () {
            var route, req, res, next;

            before(function () {
                route = app.all.firstCall.args[1];
                req = {method: 'GET'};
                res = {};
                next = spy();
                route(req, res, next);
            });

            describe('when controller action does not exist', function () {

                before(function () {
                    fallbackAction.reset();
                    route(req, res, next);
                });

                it('should call the fallbackAction, passing on arguments', function () {
                    assert.isTrue(fallbackAction.withArgs(req, res, next).calledOnce);
                });

            });

            describe('when controller action is not a function', function () {

                before(function () {
                    fallbackAction.reset();
                    controller.get = true;
                    route(req, res, next);
                });

                it('should call the fallbackAction, passing on arguments', function () {
                    assert.isTrue(fallbackAction.withArgs(req, res, next).calledOnce);
                });

            });

        });

    });

    describe('#createLoader(app)', function () {
        var app, loader;

        before(function () {
            app = {all: spy()};
            loader = ctrl.createLoader(app);
        });

        it('should return a loader function', function () {
            assert.isFunction(loader);
        });

        describe('loader(name)', function () {
            var name, controller;

            before(function () {
                name = 'foo';
                controller = {};
                stub(ctrl, 'requireController').returns(controller);
                stub(ctrl, 'addController');
                loader(name);
            });

            after(function () {
                ctrl.requireController.restore();
                ctrl.addController.restore();
            });

            it('should require the expected controller', function () {
                assert.isTrue(ctrl.requireController.withArgs('.', 'foo').calledOnce);
            });

            it('should add the required controller to the application', function () {
                assert.isTrue(ctrl.addController.withArgs(app, controller).calledOnce);
            });

        });

        describe('when app is undefined', function () {

            it('should throw an error', function () {
                assert.throws(function () {
                    ctrl.createLoader();
                }, /invalid argument/i);
            });

        });

        describe('when app is not an express application', function () {

            it('should throw an error', function () {
                assert.throws(function () {
                    ctrl.createLoader({});
                }, /invalid argument/i);
            });

        });

    });

    describe('#createLoader(app, opts)', function () {
        var app, opts, loader;

        before(function () {
            app = {all: spy()};
            opts = {
                path: '/controllers',
                fallbackAction: spy()
            };
            loader = ctrl.createLoader(app, opts);
        });

        describe('loader(name)', function () {
            var name, controller;

            before(function () {
                name = 'foo';
                controller = {};
                stub(ctrl, 'requireController').returns(controller);
                stub(ctrl, 'addController');
                loader(name);
            });

            after(function () {
                ctrl.requireController.restore();
                ctrl.addController.restore();
            });

            it('should require the expected controller based on path option', function () {
                var called = ctrl.requireController.withArgs('/controllers', 'foo').calledOnce;
                assert.isTrue(called);
            });

            it('should add the required controller to the application', function () {
                var called = ctrl.addController.withArgs(app, controller, opts.fallbackAction).calledOnce;
                assert.isTrue(called);
            });

        });

    });

});
