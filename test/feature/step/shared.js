/*jshint maxlen:160 */
'use strict';

// Dependencies
var request = require('request');

// Step definitions
module.exports = function () {
    this.World = require('../support/world').World;

    // Make a request to a page
    this.When(/^I (GET|POST|PUT|DELETE)(?: to)? the ([a-z\s\-]+) page$/i, function (method, page, callback) {
        var pageUrl = {
            'action fallbacks': '/action-fallbacks',
            'method actions': '/method-actions'
        }[page];
        if (!pageUrl) {
            return callback.fail(new Error('Unrecognised page "' + page + '".'));
        }
        var world = this;
        request({
            url: 'http://localhost:' + world.app.get('port') + pageUrl,
            method: method
        }, function (err, res, body) {
            if (err) { return callback.fail(err); }
            world.response = res;
            world.body = body;
            callback();
        });
    });

    // Expect successful response
    this.Then(/^the request should be successful$/, function (callback) {
        if (this.response === null) {
            return callback.fail(new Error('No request was made'));
        }
        if (this.response.statusCode < 200 || this.response.statusCode >= 300) {
            return callback.fail(new Error('Request was not successful; received ' + this.response.statusCode + ' status code'));
        }
        callback();
    });

    // Expect error response
    this.Then(/^the request should result in a (\d+) error$/, function (code, callback) {
        if (this.response === null) {
            return callback.fail(new Error('No request was made'));
        }
        if (this.response.statusCode !== parseInt(code, 10)) {
            return callback.fail(new Error('Request did not error correctly; received ' + this.response.statusCode + ' status code'));
        }
        callback();
    });

    // Expect to see text
    this.Then(/^I should see "([^"]*)"$/, function (text, callback) {
        if (this.body === null) {
            return callback.fail(new Error('No request was made'));
        }
        if (this.body.toLowerCase().indexOf(text.toLowerCase()) === -1) {
            return callback.fail(new Error('Text "' + text + '" not found on page'));
        }
        callback();
    });

};
