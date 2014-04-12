'use strict';

var vulpes, server, router;

vulpes = require('./lib/vulpes');

router = new vulpes.Router();
server = new vulpes.Server();

server.set_router(router);
server.start();
