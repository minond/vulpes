'use strict';

var express = require('express'),
    debug = require('debug'),
    lodash = require('lodash'),
    index = require('serve-index'),
    body = require('body-parser'),
    yaml = require('js-yaml'),
    swig = require('swig'),
    fs = require('fs');

var app = express(),
    cwd = process.cwd(),
    log = debug('vulpes:server');

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

lodash.each(yaml.safeLoad(fs.readFileSync(cwd + '/config/routes.yml', 'utf8')).routes, function (route, url) {
    var controller = require(cwd + '/app/' + route.controller + '.js');
    app[ route.method || 'get' ](url, controller[ route.action || 'index' ]);
});

app.get('/*', function (req, res, next) {
    if (req.url === '/favicon.ico') next();
    res.render(req.url.replace(/^\//, '') + '.html');
});

app.listen(process.env.PORT);
