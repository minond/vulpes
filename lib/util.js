'use strict';

/**
 * can't figure out where to put a function? put it here! just keep it
 * organized
 */
var util = {};

/**
 * string helpers
 * @property str
 * @type {Object}
 */
util.str = {
    camel_characters: /(\w)([A-Z])/g
};

/**
 * converts a camel case string into an underscored string
 *
 * @method str.camel_to_underscore
 * @example
 *     util.str.camel_to_underscore('MyUsers') => 'my_users'
 *
 * @param {string} str
 * @return {string}
 */
util.str.camel_to_underscore = function (str) {
    return str.replace(util.str.camel_characters, '$1_$2').toLowerCase();
};

module.exports = util;
