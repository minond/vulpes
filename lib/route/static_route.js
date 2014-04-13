'use strict';

var BaseRoute = require('./base_route'),
    file = require('node-static');


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

module.exports = StaticRoute;
