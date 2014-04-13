'use strict';

var BaseError = require('./base_error');

/**
 * @class NotFoundError
 * @constructor
 * @param {string} [message]
 * @param {string} [file]
 * @param {string} [line]
 */
function NotFoundError() {
    return BaseError.apply(this, arguments);
}

NotFoundError.prototype = BaseError.prototype;
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
