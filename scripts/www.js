'use strict';

var vulpes, server, router, routes, fs, yaml, log, lodash;

vulpes = require('vulpes');
yaml = require('js-yaml');
fs = require('fs');
lodash = require('lodash');
cli = require('cli-color');

router = new vulpes.Router();
server = new vulpes.Server();

log = vulpes.logger('init');
cli.xterm(232)('                        ');
cli.xterm(254)('     /\\                ');
cli.xterm(222)('    (~(                 ');
cli.xterm(222)('     ) )     /\\_/\\    ');
cli.xterm(222)('    ( _-----_(- -)      ');
cli.xterm(222)('      (       \\ /      ');
cli.xterm(222)('      /|/--\\|\\ V      ');
cli.xterm(244)('      " "   " "         ');
cli.xterm(232)('                        ');
log.info('starting vulpes application');

// load app routes
log.info('loading routes');
routes = yaml.safeLoad(fs.readFileSync(vulpes.internal.path.routes, 'utf8'));
loading(routes).each(function (info, url) {
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
