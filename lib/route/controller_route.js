'use strict';

var BaseRoute, vulpes, _;

BaseRoute = require('./base_route');
vulpes = require('../vulpes');
_ = require('lodash');

/**
 * creates a standard Injector for a request. anything can be added to it
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Function} cb
 * @return {vulpes.Injector}
 */
function std_request_injector (req, res, cb) {
    var di = new vulpes.Injector();

    di.dependency('$req', req);
    di.dependency('$res', res);
    di.dependency('$cb', cb);

    return di;
}

/**
 * routes requests to a controller's method
 *
 * @example
 *     new ControllerRoute({
 *         url: '/public/(.+)',
 *         method: BaseRoute.method.GET,
 *         controller: 'Users'
 *         action: 'edit'
 *     });
 *
 * @class StaticRoute
 * @constructor
 * @param {Object} info includes url, method, controller and action
 */
function ControllerRoute (info) {
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

/**
 * routes a request
 * @method handles
 * @param {http.IncomingMessage} req incoming request from client
 * @param {http.ServerResponse} res outgoing request to client
 * @param {Function} cb callback execulated after route is finished. this
 * callback just takes an error object
 */
ControllerRoute.prototype.route = function (req, res, cb) {
    var controller, controller_file, di;

    di = std_request_injector(req, res, cb);
    controller_file = ControllerRoute.get_controller_file(this.controller);

    try {
        controller = require(controller_file);
        di.trigger(this.action, controller);
    } catch (err) {
        cb(err);
    }
};

/**
 * template for generating paths to controllers
 * @param {Object} merge_fields
 * @return {string}
 */
ControllerRoute.controller_template = _.template(
    process.cwd() + vulpes.std.path.controller);

/**
 * generates the full path to a controller file
 *
 * @example
 *     ControllerRoute.get_controller_file('MyUsers')
 *     => './app/controllers/my_users.js'
 *
 * @method get_controller_file
 * @param {string} controller_name
 * @return {string}
 */
ControllerRoute.get_controller_file = function (controller_name) {
    controller_name = vulpes.util.str.camel_to_underscore(controller_name);
    return ControllerRoute.controller_template({ file: controller_name });
};

module.exports = ControllerRoute;
