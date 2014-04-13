'use strict';

var BaseRoute, vulpes, controller_file, camel_characters, _;

BaseRoute = require('./base_route');
vulpes = require('../vulpes');
camel_characters = /(\w)([A-Z])/g;
_ = require('lodash');

/**
 * @function controller_file
 * @param {Object} fields should include a file key
 * @return {string}
 */
controller_file = _.template(process.cwd() + '/app/controllers/${ file }.js');

/**
 * converts a camel case string into an underscored string
 *
 * @function camel_to_underscore
 * @example
 *     camel_to_underscore('MyUsers') => 'my_users'
 *
 * @param {string} str
 * @return {string}
 */
function camel_to_underscore (str) {
    return str.replace(camel_characters, '$1_$2').toLowerCase();
}

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
    var controller, controller_name, controller_path, di;

    di = std_request_injector(req, res, cb);
    controller_name = camel_to_underscore(this.controller);
    controller_path = controller_file({ file: controller_name });

    try {
        controller = require(controller_path);
        di.trigger(this.action, controller);
    } catch (err) {
        cb(err);
    }
};

module.exports = ControllerRoute;
