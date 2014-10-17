'use strict';

var DEBUG = process.env.NODE_ENV === 'development',
    make;

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    log = require('debug')('vulpes:server'),
    config = require('acm');

var join = require('path').join,
    format = require('util').format,
    filter = require('lodash-node/modern/collections/filter'),
    map = require('lodash-node/modern/collections/map');

function views(app, dir) {
    app.set('view engine', 'html');
    app.set('views', dir + '/assets/views/');
    app.engine('html', require('swig').renderFile);
}

function static_routes(app, dir, config) {
    map(config.get('routes.=static'), function (path, url) {
        path = join(dir, path);

        log('static route %s (%s)', url, path);
        app.use(url, require('serve-static')(path));

        if (DEBUG) {
            log('serving index %s (%s)', url, path);
            app.use(url, require('serve-index')(path));
        }
    });
}

function dynamic_routes(app, dir, base, routes) {
    map(filter(routes, function (route, url) {
        route.url = url;
        return url[0] !== '=';
    }), function (route) {
        var method, action, controller;

        if (route.mount) {
            log('mounting %s on %s', route.mount, route.url);

            app.use(make(
                express(),
                route.mount,
                route.url,
                new config.Configuration({ paths: [
                    join(route.mount, 'config'),
                    join(route.mount, 'node_modules', 'vulpes', 'config')
                ] })
            ));

            return;
        }

        method = route.method || 'get';
        action = route.action || 'index';
        route.url = base + route.url;

        log('dynamic route %s (%s#%s)', route.url, route.controller, action);
        controller = require(format('%s/app/controllers/%s.js', dir, route.controller));
        app[ method ](route.url, controller[ action ]);
    });
}

function make(app, dir, base, config) {
    static_routes(app, dir, config);
    views(app, dir);
    dynamic_routes(app, dir, base, config.get('routes'));
    return app;
}

config.$paths.push(join(__dirname, '..', 'config'));

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.use(require('cookie-parser')(config.get('application.cookies.secret')));
app.use(function (req, res, next) { req.io = io; return next(); });

make(app, process.cwd(), '', config);

if (DEBUG) {
    log('detected development enviroment');
    require('swig').setDefaults({ cache: false });
    require('errorhandler').title = require(process.cwd() + '/package.json').name;
    app.set('view cache', false);
    app.use(require('errorhandler')());
}

app.use(require('pageview')(app.get('views')));
app.use(require('not-found')(app.get('views') + '404.html'));

server.listen(process.env.PORT || 5000);
