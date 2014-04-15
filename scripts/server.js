'use strict';

var vulpes, server, router;

vulpes = require('vulpes');

router = new vulpes.Router();
server = new vulpes.Server();

router.routes.push(new vulpes.route.StaticRoute({
    url: '/public/(.+)',
    dir: './public'
}));

router.routes.push(new vulpes.route.ControllerRoute({
    url: '/users',
    controller: 'Users',
    action: 'edit'
}));

server.set_router(router);
server.start();
