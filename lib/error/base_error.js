'use strict';

/**
 * @class BaseError
 * @constructor
 * @param {string} [message]
 * @param {string} [file]
 * @param {string} [line]
 */
function BaseError() {
    return Error.apply(this, arguments);
}

BaseError.prototype = Error.prototype;
BaseError.prototype.constructor = BaseError;

module.exports = BaseError;
