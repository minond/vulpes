'use strict';

var BaseRoute = require('./base_route');

function ControllerRoute(info) {
    info = info || {};
    BaseRoute.call(this, info);

    /**
     * controller to route to
     * @property controller
     * @type {string}
     */
    this.controller = info.controller;

    /**
     * controller's action to route to
     * @property action
     * @type {string}
     */
    this.action = info.action;
}

ControllerRoute.prototype = Object.create(BaseRoute.prototype);
ControllerRoute.prototype.constructor = ControllerRoute;

module.exports = ControllerRoute;
