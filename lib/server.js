'use strict';

var http, log, _;

http = require('http');
log = require('./logger')('server');
_ = require('lodash');

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

    log.art.fox(log);
    log.info('starting server on %s:%s', hostname, port);
    this.server = http.createServer(router.handle.bind(router));
    this.server.listen(port, hostname);
};

module.exports = Server;
