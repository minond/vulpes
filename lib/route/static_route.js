'use strict';

var BaseRoute = require('./base_route'),
    fs = require('fs'),
    path = require('path'),
    file = require('node-static'),
    vulpes = require('../vulpes'),
    _ = require('lodash');

var log = vulpes.logger('static_route');

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

StaticRoute.prototype = Object.create(BaseRoute.prototype);
StaticRoute.prototype.constructor = StaticRoute;

/**
 * routes a request
 * @method handles
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 * @param {Function} cb callback execulated after route is finished. this
 * callback just takes an error object
 */
StaticRoute.prototype.route = function (req, res, cb) {
    var server = this.server,
        file = _.last(req.url.match(this.compiled_url)),
        filepath = path.resolve(this.dir, file);

    fs.exists(filepath, function (exists) {
        if (exists) {
            req.addListener('end', function () {
                server.serveFile(file, 200, {}, req, res);
                log.info('serving %s', file);
                cb(null);
            }).resume();
        } else {
            cb(new vulpes.error.NotFoundError());
        }
    });
};

module.exports = StaticRoute;
