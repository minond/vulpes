'use strict';

var build = require('./application').build,
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
build(app, process.cwd(), '', config, process.env.NODE_ENV === 'development');
server.listen(process.env.PORT || 5000);
