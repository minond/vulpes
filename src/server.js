'use strict';

var pkg = require(process.cwd() + '/package.json'),
    make = require('./application');

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    config = require('acm');

var join = require('path').join;

var body_parser = require('body-parser'),
    cookie_parser = require('cookie-parser'),
    not_found = require('not-found'),
    page_view = require('pageview'),
    error_handler = require('errorhandler');

config.$paths.push(join(__dirname, '..', 'config'));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(cookie_parser(config.get('application.cookies.secret')));

app.use(function (req, res, next) {
    req.io = io;
    req.pkg = pkg;
    req.config = config;
    return next();
});

make(app, process.cwd(), '', config);

if (process.env.NODE_ENV === 'development') {
    error_handler.title = pkg.name;
    app.use(error_handler());
}

app.use(page_view(app.get('views')));
app.use(not_found(app.get('views') + '404.html'));
server.listen(process.env.PORT || 5000);
