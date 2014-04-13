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
            // on_error
        }
    } else {
        // on_not_found
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('not found');
    }
};

module.exports = Router;
