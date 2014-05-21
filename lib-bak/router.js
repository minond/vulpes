'use strict';

var vulpes, log, _;

vulpes = require('./vulpes');
log = vulpes.logger('router');
_ = require('lodash');

/**
 * routes holder
 * @class Router
 * @constructor
 */
function Router () {
    /**
     * array of application routes
     * @property routes
     * @type {Array}
     */
    this.routes = [];
}

/**
 * handles incoming requests
 * @method request_handler
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 */
Router.prototype.handle = function (req, res) {
    var route, router, start_time, end_time;

    start_time = Date.now();
    router = this;
    route = _.find(this.routes, function (route) {
        return route.handles(req);
    });

    if (route) {
        log.info('routing %s', req.url);
        route.route(req, res, function (err) {
            if (err) {
                if (err instanceof vulpes.error.NotFoundError) {
                    router.on_not_found(req, res);
                } else {
                    router.on_error(req, res, err);
                }
            } else {
                end_time = Date.now();
                log.info('routed %s (%sms)', req.url, end_time - start_time);
            }
        });
    } else {
        this.on_not_found(req, res);
    }
};

/**
 * ran when requested resource was not found
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 */
Router.prototype.on_not_found = function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('not found');
    log.warn('resource not found');
};

/**
 * ran when request fails
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 * @param {Error} err the error that was caught
 */
Router.prototype.on_error = function (req, res, err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('server error');
    log.error('error handling request: %s', err.message);
};

module.exports = Router;
