'use strict';

/* jshint latedef:false */

var DEBUG = process.env.NODE_ENV === 'development';

var express = require('express'),
    config = require('acm'),
    swig = require('swig'),
    serve_static = require('serve-static'),
    serve_index = require('serve-index'),
    log = require('debug')('vulpes:app');

var fs = require('fs'),
    join = require('path').join,
    format = require('util').format;

var filter = require('lodash-node/modern/collections/filter'),
    map = require('lodash-node/modern/collections/map');

/**
 * sets up view serving informaiton on an app
 * @function serve_views
 * @param {express} app
 * @param {String} dir base directory
 * @return {express}
 */
function serve_views(app, dir) {
    var lswig = new swig.Swig();
    app._.swig = lswig;

    app.set('view engine', 'html');
    app.set('views', dir + '/assets/views/');
    app.engine('html', lswig.renderFile);

    if (DEBUG) {
        app.set('view cache', false);
        lswig.options.cache = false;
    }

    return app;
}

/**
 * sets up the static, file serving, routes
 * @function static_routes
 * @param {express} app
 * @param {String} dir base directory
 * @param {acm} config
 * @return {express} app
 */
function static_routes(app, dir, config) {
    map(config.get('routes.=static'), function (path, url) {
        path = join(dir, path);

        log('static route %s (%s)', url, path);
        app.use(url, serve_static(path));

        if (DEBUG) {
            log('serving index %s (%s)', url, path);
            app.use(url, serve_index(path));
        }
    });

    return app;
}

/**
 * mounts a separate app on a base url
 * @function dynamic_route_mount
 * @param {express} app
 * @param {String} dir base directory
 * @param {String} base url prefix
 * @param {Object} route definition from app config
 * @return {express}
 */
function dynamic_route_mount(app, dir, base, route) {
    log('mounting %s on %s', route.mount, route.url);

    app.use(make(
        express(),
        route.mount,
        base + route.url,
        new config.Configuration({
            paths: [
                join(route.mount, 'config'),
                join(route.mount, 'node_modules', 'vulpes', 'config')
            ]
        })
    ));

    return app;
}

/**
 * creates a dynamic route that calls a handler function
 * @function dynamic_route_handler
 * @param {express} app
 * @param {String} dir base directory
 * @param {String} base url prefix
 * @param {Object} route definition from app config
 * @return {express}
 */
function dynamic_route_handler(app, dir, base, route) {
    var handler, func;

    log('dynamic route %s handled by %s', route.url, route.handler);

    func = route.handler.split('#').pop();
    handler = route.handler.split('#').shift();
    handler = require(format('%s/app/%s.js', dir, handler));
    app[ route.method || 'get' ](base + route.url, handler[ func ].bind(handler));

    return app;
}

/**
 * creates a dynamic route that just serves a static file
 * @function dynamic_route_serve
 * @param {express} app
 * @param {String} dir base directory
 * @param {String} base url prefix
 * @param {Object} route definition from app config
 * @return {express}
 */
function dynamic_route_serve(app, dir, base, route) {
    app.all(base + route.url, function (req, res) {
        res.render(route.serve);
    });
}

/**
 * sets up all configured routes
 * @function dynamic_routes
 * @param {express} app
 * @param {String} dir base directory
 * @param {String} base url prefix
 * @param {Object} route definition from app config
 * @return {express}
 */
function dynamic_routes(app, dir, base, routes) {
    map(filter(routes, function (route, url) {
        route.url = url;
        return url[0] !== '=';
    }), function (route) {
        if (route.mount) {
            dynamic_route_mount(app, dir, base, route);
        } else if (route.serve) {
            dynamic_route_serve(app, dir, base, route);
        } else {
            dynamic_route_handler(app, dir, base, route);
        }
    });

    return app;
}

/**
 * @function run_initializers
 * @param {express} app
 * @param {String} dir base directory
 * @return {express}
 */
function run_initializers(app, dir) {
    var initalizers_dir = join(dir, 'config', 'initializers');

    if (fs.existsSync(initalizers_dir)) {
        fs.readdirSync(initalizers_dir).forEach(function (file) {
            if (file.substr(-3) !== '.js') {
                return;
            }

            log('loading %s initializer', file);
            file = join(initalizers_dir, file);
            require(file)(app._);
        });
    }
}

/**
 * builds an app
 * @function make
 * @param {express} app
 * @param {String} dir base directory
 * @param {String} base url prefix
 * @param {Object} route definition from app config
 * @return {express}
 */
function make(app, dir, base, config) {
    app._ = {
        app: app,
        config: config,
        dir: dir,
        base: base,
    };

    static_routes(app, dir, config);
    serve_views(app, dir);
    dynamic_routes(app, dir, base, config.get('routes'));
    run_initializers(app, dir);

    return app;
}

module.exports = {
    make: make,
    dynamic_route_handler: dynamic_route_handler,
    dynamic_route_mount: dynamic_route_mount,
    dynamic_route_serve: dynamic_route_serve,
    dynamic_routes: dynamic_routes,
    run_initializers: run_initializers,
    serve_views: serve_views,
    static_routes: static_routes,
};
