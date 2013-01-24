'use strict';

var ctrl = exports;

// Dependencies
var resolvePath = require('path').resolve;


// Public

// Load a controller
ctrl.requireController = function (dir, name) {
    var path = resolvePath(dir, name);
    try {
        return require(path);
    } catch (err) {
        throw new Error('Controller "' + path + '" could not be loaded');
    }
};

// Add a controller to the application
ctrl.addController = function (app, controller, fallbackAction) {
    app.all(controller.route, function (req, res, next) {
        var action = ctrl.addController.resolveAction(controller, req.method, fallbackAction);
        if (typeof action !== 'function') { return next(); }
        action(req, res, next);
    });
};

// Resolve a controller action, returning the action function or a fallback if not present
ctrl.addController.resolveAction = function (controller, actionName, fallbackAction) {
    var action = controller[actionName.toLowerCase()];
    if (typeof action !== 'function') { action = fallbackAction; }
    return action;
};

// Create a controller loader
ctrl.createLoader = function (app, opts) {
    assertExpressApp(app);
    opts = ctrl.createLoader.defaultOpts(opts);
    return function (name) {
        var controller = ctrl.requireController(opts.path, name);
        ctrl.addController(app, controller, opts.fallbackAction);
    };
};

// Add default values to createLoader options
ctrl.createLoader.defaultOpts = function (opts) {
    if (typeof opts !== 'object') { opts = {}; }
    if (typeof opts.path !== 'string') { opts.path = './controllers'; }
    return opts;
};


// Private

// Assert that a value is an express application
function assertExpressApp (val) {
    if (!isExpressApp(val)) {
        throw new Error('Invalid Argument: app is expected to be an Express application');
    }
}

// Check whether a value is an express application
function isExpressApp (val) {
    return (val && typeof val.all === 'function');
}
