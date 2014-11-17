'use strict';

var build = require('./build').build,
    join = require('path').join;

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    config = require('acm');

app.use(function (req, res, next) {
    req.io = io;
    return next();
});

config.$paths.push(join(__dirname, '..', 'config'));
module.exports = build(app, process.cwd(), '', config, process.env.NODE_ENV === 'development');
module.exports.server = server;
