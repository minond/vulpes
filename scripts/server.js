'use strict';

var Builder = require('../src/builder'),
    builder = new Builder();

var Injector = require('argument-injector'),
    injector = new Injector();

var express = require('express'),
    index = require('serve-index'),
    body = require('body-parser'),
    swig = require('swig');

var lodash = require('lodash'),
    yaml = require('yamljs'),
    fs = require('fs');

var app = express(),
    cwd = process.cwd(),
    log = require('debug')('vulpes:server');

app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use('/lib', express.static(cwd + '/lib/'));
app.use('/assets', express.static(cwd + '/assets/'));
app.set('view engine', 'html');
app.set('views', cwd + '/assets/views/');
app.engine('html', swig.renderFile);

if (process.env.NODE_ENV === 'development') {
    app.use('/lib', index(cwd + '/lib/', { icons: true }));
    app.use('/assets', index(cwd + '/assets/', { icons: true }));
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

if (fs.existsSync(cwd + '/config/bootup.js')) {
    log('loading application bootup file');
    require(cwd + '/config/bootup.js')(app, injector);
}

// application routes
var routes = builder.routes(yaml.load(cwd + '/config/routes.yml').routes);

lodash.each(routes, function (route) {
    var controller = require(route.controller);
    app[ route.method ](route.url, injector.bind(controller[ route.action ]));
});

// static resource routes
app.get('/*', function (req, res, next) {
    if (req.url === '/favicon.ico') {
        next();
    }
    res.render(req.url.replace(/^\//, '') + '.html');
});

app.listen(process.env.PORT || 5000);
