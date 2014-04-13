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
    BaseError.apply(this, arguments);
    this.name = 'NotFoundError';
}

NotFoundError.prototype = Object.create(BaseError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;
