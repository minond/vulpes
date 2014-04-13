'use strict';

var BaseRoute = require('./base_route');

function StaticRoute(info) {
    info = info || {};
    BaseRoute.call(this, info);

    /**
     * base directory holding statis files
     * @property dir
     * @type {string}
     */
    this.dir = info.dir;
}

StaticRoute.prototype = new BaseRoute;
StaticRoute.prototype.constructor = StaticRoute;

module.exports = StaticRoute;
