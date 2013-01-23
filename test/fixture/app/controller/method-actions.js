'use strict';

exports.route = '/method-actions';

exports.get = function (req, res) {
    res.send('Got!');
};

exports.post = function (req, res) {
    res.send('Posted!');
};
