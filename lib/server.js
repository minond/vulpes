'use strict';

var http = require('http'),
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
    this.server = http.createServer(Server.request_handler);

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
 * handles incoming requests
 * @static
 * @method request_handler
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 */
Server.request_handler = function (req, res) {
    console.info('routing %s', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hi');
};

/**
 * start listening to requests
 * @method start
 */
Server.prototype.start = function () {
    var port = this.config.port,
        hostname = this.config.hostname;

    console.info('starting server on %s:%s', hostname, port);
    this.server.listen(port, hostname);
};

module.exports = Server;
