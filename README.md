
Express Ctrl
============

Express Ctrl is a light wrapper, providing a controller-like interface to Express routing.

**Current Version:** *0.0.0*  
**Automated Build Status:** [![Build Status][travis-status]][travis]  
**Node Version Support:** *0.6, 0.8*


Quick-Start
-----------

Your main application bootstrap:

```js
var express = require('express');
var ctrl = require('express-ctrl');

// Create your Express app
var app = express();

// Create a controller loader function
var loadController = ctrl.createLoader(app, {
    path: __dirname + '/controllers'
});

// Load controllers (looks for modules in the path provided)
loadController('index');
loadController('blog');
```

Example controller `controllers/blog.js`:

```js
exports.route = '/blog';

exports.get = function (req, res) {
    // show blog posts
};

exports.post = function (req, res) {
    // add a new blog post
};
```


Installing
----------

Install Express Ctrl with [Node.js/npm][node] by either adding `express-ctrl` to your `package.json` dependencies, or running the following:

```sh
$ npm install express-ctrl
```


Usage
-----

Once installed, you can just require `express-ctrl`:

```js
var ctrl = require('express-ctrl');
// or include the loader generator directly
var createLoader = require('express-ctrl').createLoader;
```

### createLoader()

Create a loader function. This accepts two arguments:  
**app:** *(app)* An Express application instance.  
**opts:** *optional (object)* Loader options.  
**opts.path:** *(string)* The path to look for controllers in. Defaults to `'./controllers'`.  
**opts.fallbackAction:** *(function)* A function to call if a controller action matching the request method is not found. This is useful for sending `405` errors.  
**return:** *(function)* Returns a [loader function](#createloader-returned-function).

```js
var app = express();

var loadController = ctrl.createLoader(app, {
    
    // The 'controllers' folder relative to this file
    path: __dirname + '/controllers',

    // 405 error
    fallbackAction: function (req, res) {
        res.send(405, 'Method Not Allowed');
    }

});
```

### createLoader() Returned Function

Load a controller (uses the configuration passed into [`createLoader`](#createloader)). This accepts a single argument:  
**name:** *(string)* The name of the controller to load. This is appended to the loader path specified in [`createLoader`](#createloader).

When a controller is loaded this way, a route is added using `express.all` with the controller route.

```js
// if the controller loader path is set to './controllers',
// this will require './controllers/blog.js'.
loadController('blog');
```

### Controller Module Structure

A controller module is expected to export a few properties. Things might break if you don't export at least a `route` property:

```js
// This is the route that will be used when adding this
// controller to Express. This can contain regular expressions
// and express params
exports.route = '/blog';

// This function will respond to GET requests to the
// controller route
exports.get = function (req, res) {};

// This function will respond to POST requests to the
// controller route
exports.post = function (req, res) {};

// You can respond to as many or as few request methods
// as you like. Just export functions matching the method,
// for example 'put' or 'delete'.
```

For example usage, take a look at the [application][test-app] being used for testing.


Development
-----------

To develop Express Ctrl, you'll need to clone the repo and install dependencies. You'll need Node and npm installed to run the following:

```sh
$ make deps
```

No code will be accepted unless all tests are passing and there are no lint errors – you check this with `make`. Build commands are outlined below:

```sh
$ make # run everything (required to pass)
$ make deps # install dependencies
$ make lint # run jshint with the correct config
$ make test # run all unit and cucumber feature tests
$ make test-unit # run all unit tests
$ make test-feature # run all cucumber feature tests
```


License
-------

Express Ctrl is licensed under the [MIT][mit] license.



[mit]: http://opensource.org/licenses/mit-license.php
[node]: http://nodejs.org/
[test-app]: https://github.com/rowanmanning/express-ctrl/tree/master/test/fixture/app
[travis]: https://travis-ci.org/rowanmanning/express-ctrl
[travis-status]: https://travis-ci.org/rowanmanning/express-ctrl.png?branch=master

