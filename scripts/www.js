'use strict';

var vulpes, server, router, routes, fs, yaml, log, _;

vulpes = require('vulpes');
yaml = require('js-yaml');
fs = require('fs');
_ = require('lodash');

router = new vulpes.Router();
server = new vulpes.Server();

log = vulpes.logger('init');
log.art.fox(log);
log.info('starting vulpes application');

// load app routes
log.info('loading routes');
routes = yaml.safeLoad(fs.readFileSync(vulpes.internal.path.routes, 'utf8'));
_(routes).each(function (info, url) {
    var route;

    switch (true) {
        case 'controller' in info:
            log.debug('saving "%s" as a controller route', url);
            route = vulpes.route.ControllerRoute;
            break;

        case 'dir' in info:
            log.debug('saving "%s" as a static route', url);
            route = vulpes.route.StaticRoute;
            break;
    }

    info.url = url;
    router.routes.push(new route(info));
});

log.info('completed initializing app');
server.set_router(router);
server.start();
