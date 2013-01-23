'use strict';

// Dependencies
var ctrl = require('../../..');
var express = require('express');
var path = require('path');

// Create app
var app = express();

// Create a controller loader
var loadController = ctrl.createLoader(app, {
    path: path.join(__dirname, 'controller'),
    fallbackAction: function (req, res) {
        res.send(405, 'Method Not Allowed');
    }
});

// Load test controllers
loadController('action-fallbacks');
loadController('method-actions');

// Listen on a port
var port = 3082;
app.set('port', port);
app.listen(port);
console.log('Test application listening on port %s', port);

// Exports
exports.app = app;
