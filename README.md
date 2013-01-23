
Express Ctrl
============

Express Ctrl is a light wrapper, providing a controller-like interface to Express routing.

**Current Version:** *0.0.0*  
**Automated Build Status:** [![Build Status][travis-status]][travis]  
**Node Version Support:** *0.6, 0.8*


Installing
----------

Install Express Ctrl with [Node.js/npm][node] by either adding `express-ctrl` to your `package.json` dependencies, or running the following:

```sh
$ npm install express-ctrl
```


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
[travis]: https://secure.travis-ci.org/rowanmanning/express-ctrl
[travis-status]: https://secure.travis-ci.org/rowanmanning/express-ctrl.png?branch=master

