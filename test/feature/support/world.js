'use strict';

// Create test app
var app = require('../../fixture/app').app;

// Create world
exports.World = function (callback) {
    this.app = app;
    this.response = null;
    this.body = null;
    callback();
};
