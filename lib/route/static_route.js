'use strict';

var BaseRoute = require('./base_route');
var fs = require('fs');
var path = require('path');
var file = require('node-static');
var _ = require('lodash');

function StaticRoute(info) {
    info = info || {};
    BaseRoute.call(this, info);

    /**
     * base directory holding statis files
     * @property dir
     * @type {string}
     */
    this.dir = info.dir;

    /**
     * for serving static files
     * @property server
     * @type {node-static.Server}
     */
    this.server = new file.Server(this.dir);
}

StaticRoute.prototype = new BaseRoute;
StaticRoute.prototype.constructor = StaticRoute;

/**
 * routes a request
 * @method handles
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 */
StaticRoute.prototype.route = function (req, res) {
    var server = this.server,
        file = _.last(req.url.match(this.compiled_url));

    if (!fs.existsSync(path.resolve(this.dir, file))) {
        throw new Error('not found!');
    }

    req.addListener('end', function () {
        server.serveFile(file, 200, {}, req, res);
    }).resume();
};

module.exports = StaticRoute;
