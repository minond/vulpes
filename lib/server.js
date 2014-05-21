'use strict';

var http = require('http'),
    util = require('util'),
    lodash = require('lodash'),
    events = require('events'),
    logger = require('./logger');

/**
 * @class Server
 * @constructor
 * @param {Object} [config] - information/configuration for running server
 */
function Server (config) {
    /**
     * @property router
     * @type {vulpes.Router}
     */
    this.router = null;

    /**
     * @property server
     * @type {http.Server}
     */
    this.server = null;

    /**
     * information/configuration for running server
     * @property config
     * @type {Object}
     */
    this.config = lodash.defaults(config || {}, Server.DEFAULTS);

    /**
     * @type {vulpes.logger}
     * @method log
     */
    this.log = logger(util.format('%s:%s', this.config.hostname,
        this.config.port));
}

/**
 * @event start - when a server is started
 */
util.inherits(Server, events.EventEmitter);

/**
 * default configuration
 * @type {Object}
 * @property DEFAULTS
 * @final
 */
Server.DEFAULTS = {
    hostname: '0.0.0.0',
    port: 9000
};

/**
 * @method start
 */
Server.prototype.start = function () {
    var port = this.config.port,
        hostname = this.config.hostname,
        router = this.router;

    this.log.info('starting server on %s:%s', hostname, port);
    this.emit('start');

    this.server = http.createServer(router.route);
    this.server.listen(port, hostname);
};

module.exports = Server;
