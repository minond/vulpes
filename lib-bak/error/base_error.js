'use strict';

/**
 * @class BaseError
 * @constructor
 * @param {string} [message]
 * @param {string} [file]
 * @param {string} [line]
 */
function BaseError(message, file, line) {
    this.name = 'BaseError';
    this.message = message;
    this.file = file;
    this.line = line;
}

// inheritance from Error is a little special
BaseError.prototype = new Error();
BaseError.prototype.constructor = BaseError;

module.exports = BaseError;
