'use strict';

var colors, stemplate, ctemplate, padding, _;

_ = require('lodash');
colors = require('colors');
stemplate = '${ isodate }${ padding }[${ level }] (${ name }) ${ message }';
ctemplate = _.template(stemplate);

padding = {
    error: ' ',
    info: '  ',
    log: '   ',
    warn: '  ',
};

colors.setTheme({
    error: 'red',
    info: 'blue',
    log: 'green',
    warn: 'yellow',
});

/**
 * @function isodate
 * @return {string} ISO formatted date
 */
function isodate() {
    var d = new Date();
    return d.toISOString();
}

/**
 * @function create_log_string
 * @param {string} level
 * @param {string} name
 * @param {string} message
 */
function create_log_string(level, name, message) {
    return ctemplate({
        isodate: isodate(),
        padding: padding[ level ],
        level: level.toUpperCase()[level],
        message: message,
        name: name,
    });
}

/**
 * @function log_message
 * @param {string} level
 * @param {string} name
 * @param {Array} messages arguments to pass to console function
 */
function log_message(level, name, messages) {
    var args = _.tail(messages),
        message = _.first(messages),
        log = create_log_string(level, name, message);

    args.unshift(log);
    console[level].apply(console, args);
}

/**
 * returns a logger function
 * @param {string} level
 * @param {string} name
 * @return {Function}
 */
function log_function (level, name) {
    return function () {
        log_message(level, name, arguments);
    };
}

/**
 * create a new logger
 *
 * @example
 *     var mylog = logger('mylog');
 *     mylog('a regular log');
 *     mylog.log('another regular log');
 *     mylog.info('information log');
 *     mylog.warn('a warning');
 *     mylog.error('an error');
 *
 * @class logger
 * @constructor
 * @param {string} name logger name
 * return {Object}
 */
function logger(name) {
    /**
     * @method info
     * @param {string} [message]*
     */
    var instance = log_function('log', name);

    /**
     * @method log
     * @param {string} [message]*
     */
    instance.log = log_function('log', name);

    /**
     * @method info
     * @param {string} [message]*
     */
    instance.info = log_function('info', name);

    /**
     * @method warn
     * @param {string} [message]*
     */
    instance.warn = log_function('warn', name);

    /**
     * @method error
     * @param {string} [message]*
     */
    instance.error = log_function('error', name);

    return instance;
}

module.exports = logger;
