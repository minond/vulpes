'use strict';

/**
 * prepends and appends start and end regular expression characters
 * @param {string} url
 * @return {string}
 */
function regexp_start_end (str) {
    return '^' + str + '$';
}

/**
 * an application route
 *
 * <code>
 * new BaseRoute({
 *     url: '/users/:id/edit',
 *     method: BaseRoute.method.GET,
 *     controller: 'Users',
 *     action: 'edit'
 * });
 * </code>
 *
 * @class BaseRoute
 * @constructor
 * @param {Object} info includes url, method, controller, and action
 */
function BaseRoute (info) {
    info = info || {};

    /**
     * human representation of url
     * @property url
     * @type {string}
     */
    this.url = info.url;

    /**
     * regexp representation of url
     * @property compiled_url
     * @type {RegExp}
     */
    this.compiled_url = BaseRoute.compile_template_url(info.url);

    /**
     * method type
     * @property method
     * @type {string}
     */
    this.method = info.method || BaseRoute.method.ANY;

    /**
     * method type
     * @property compiled_method
     * @type {RegExp}
     */
    this.compiled_method = new RegExp(regexp_start_end(this.method));
}

/**
 * method constants
 * should be regular expressions friendly
 * @static
 * @final
 * @property method
 * @type {Object}
 */
BaseRoute.method = {
    ANY: '.+',
    CONNECT: 'CONNECT',
    DELETE: 'DELETE',
    GET: 'GET',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
    POST: 'POST',
    PUT: 'PUT',
    TRACE: 'TRACE'
};

/**
 * compiles a template url into a regular expression
 * TODO finish method
 * @static
 * @method compile_template_url
 * @param {string} url hunman url
 * @return {RegExp} regular expressions url
 */
BaseRoute.compile_template_url = function (url) {
    return new RegExp(regexp_start_end(url));
};

/**
 * tell you if this route is for a specific url
 * @method handles
 * @param {http.IncomingMessage} req incoming request from client
 * @param {Boolean} true if this route is for the url
 */
BaseRoute.prototype.handles = function (req) {
    return this.compiled_method.test(req.method) &&
        this.compiled_url.test(req.url);
};

module.exports = BaseRoute;
