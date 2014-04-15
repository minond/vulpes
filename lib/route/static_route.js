'use strict';

var BaseRoute, fs, path, file, vulpes, log, _;

BaseRoute = require('./base_route');
fs = require('fs');
path = require('path');
file = require('node-static');
vulpes = require('../vulpes');
log = vulpes.logger('static_route');
_ = require('lodash');

/**
 * serves static resources
 *
 * @example
 *     new StaticRoute({
 *         url: '/public/(.+)',
 *         method: BaseRoute.method.GET,
 *         dir: './public'
 *     });
 *
 * @class StaticRoute
 * @constructor
 * @param {Object} info includes url, method, and directory
 */
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
 * name of index files
 * @property index
 * @static
 * @type {string}
 */
StaticRoute.index = '/index.html';

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
            fs.stat(filepath, function (err, stat) {
                if (stat.isDirectory()) {
                    file += StaticRoute.index;
                }

                req.addListener('end', function () {
                    server.serveFile(file, 200, {}, req, res);
                    log.info('serving %s', file);
                    cb(null);
                }).resume();
            });
        } else {
            cb(new vulpes.error.NotFoundError());
        }
    });
};

module.exports = StaticRoute;
