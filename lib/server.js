'use strict';

var http = require('http'),
    file = require('node-static'),
    _    = require('lodash');

/**
 * create a new application server
 * @class Server
 * @constructor
 * @param {Object} [config] application's configuration
 */
function Server (config) {
    config = _.isPlainObject(config) ? config : {};

    /**
     * the actual node server
     * @property server
     * @type {http.Server}
     */
    this.server = null;

    /**
     * for serving static files
     * @property static_server
     * @type {node-static.Server}
     */
    this.static_server = null;

    /**
     * connection configuration
     * @property config
     * @type {Object}
     */
    this.config = _.defaults(config, {
        hostname: '0.0.0.0',
        port: 9000
    });
}

/**
 * router setter
 * @method router
 * @param {vulpes.Router} router
 */
Server.prototype.set_router = function (router) {
    this.router = router;
};

/**
 * start listening to requests
 * @method start
 */
Server.prototype.start = function () {
    var port = this.config.port,
        hostname = this.config.hostname,
        router = this.router;

    console.info('starting server on %s:%s', hostname, port);
    this.static_server = new file.Server();
    this.server = http.createServer(router.handle);
    this.server.listen(port, hostname);
};

module.exports = Server;
