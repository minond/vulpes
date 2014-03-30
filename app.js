(function () {
    'use strict';

    var server, vulpes;

    vulpes = require('./vulpes/vulpes');
    server = new vulpes.Server();
    server.start();
})();
