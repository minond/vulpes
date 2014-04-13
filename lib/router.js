'use strict';

var _ = require('lodash');

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
    var route = _.find(this.routes, function (route) {
        return route.handles(req);
    });

    if (route) {
        try {
            route.route(req, res);
        } catch (e) {
            this.on_error(req, res);
        }
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
};

/**
 * ran when request fails
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 */
Router.prototype.on_error = function (req, res) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('server error');
};

module.exports = Router;
