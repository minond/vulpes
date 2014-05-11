'use strict';

/**
 * can't figure out where to put a function? put it here! just keep it
 * organized
 */
module.exports = {
    /**
     * string helpers
     * @property str
     * @type {Object}
     */
    str: {
        camel_characters: /(\w)([A-Z])/g,

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
        camel_to_underscore: function (str) {
            return str.replace(this.camel_characters, '$1_$2').toLowerCase();
        }
    }
};
