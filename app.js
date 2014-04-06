(function () {
    'use strict';

    var server, vulpes;

    vulpes = require('./lib/vulpes');
    server = new vulpes.Server();
    server.start();
})();
