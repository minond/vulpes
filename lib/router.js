'use strict';

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
    console.info('routing %s', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hi');
};

module.exports = Router;
