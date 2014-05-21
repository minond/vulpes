'use strict';

var cli = require('cli-color'),
    lodash = require('lodash');

/**
 * create a new logger
 *
 * @example
 *     var mylog = logger('mylog');
 *     mylog('a regular log');
 *     mylog.debug('debug information');
 *     mylog.info('information log');
 *     mylog.warn('a warning');
 *     mylog.error('an error');
 *
 * @class logger
 * @constructor
 * @param {string} name logger name
 * return {Object}
 */
function logger (name) {
    /**
     * @method info
     * @param {string} [message]*
     */
    var instance = console.log.bind(console);

    /**
     * @method debug
     * @param {string} [message]*
     */
    instance.debug = logger.generate(logger.level.DEBUG, name, instance);

    /**
     * @method info
     * @param {string} [message]*
     */
    instance.info = logger.generate(logger.level.INFO, name, instance);

    /**
     * @method warn
     * @param {string} [message]*
     */
    instance.warn = logger.generate(logger.level.WARN, name, instance);

    /**
     * @method error
     * @param {string} [message]*
     */
    instance.error = logger.generate(logger.level.ERROR, name, instance);

    /**
     * reference to art object
     * @property art
     * @type {Object}
     */
    instance.art = logger.art;

    return instance;
}

/**
 * @method template
 * @static
 * @param {Object} merge_fields
 * @return {string}
 */
logger.template = lodash.template('${ isodate }${ padding }[${ level }] (${ name }) ${ message }');

/**
 * map with colors by lob level
 * @property color
 * @type {Object}
 * @static
 */
logger.color = {
    debug: cli.xterm(104),
    error: cli.xterm(167),
    info: cli.xterm(79),
    warn: cli.xterm(229),
};

/**
 * map of log levels
 * @TODO logger should check supported levels
 * @type {Object}
 * @final
 * @static
 */
logger.level = {
    ART: 'art',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
};

/**
 * string template merge fields
 * @type {Object}
 * @static
 */
logger.field = {
    /**
     * @function isodate
     * @return {string} ISO formatted date
     */
    isodate: function () {
        var d = new Date();
        return d.toISOString();
    },

    /**
     * @function padding
     * @param {string} level
     * @return {string}
     */
    padding: function (level) {
        var padding = {
            debug: ' ',
            error: ' ',
            info: '  ',
            warn: '  ',
        };

        return padding[ level ];
    },

    /**
     * @function level
     * @param {string} level
     * @return {string}
     */
    level: function (level) {
        return logger.color[ level ](level.toUpperCase());
    }
};

/**
 * @method line
 * @static
 * @param {Function} template
 * @param {string} level
 * @param {string} name
 * @param {string} message
 */
logger.line = function (template, level, name, message) {
    level = level || logger.level.INFO;

    return template({
        isodate: logger.field.isodate(),
        padding: logger.field.padding(level),
        level: logger.field.level(level),
        message: message,
        name: name,
    });
};

/**
 * returns a logger function
 * @method generate
 * @static
 * @param {string} level
 * @param {string} name
 * @param {Function} clog - access to console.log
 * @return {Function}
 */
logger.generate = function (level, name, clog) {
    return function () {
        var args = lodash.tail(arguments),
            message = lodash.first(arguments),
            log = logger.line(logger.template, level, name, message);

        args.unshift(log);
        clog.apply(console, args);
    };
};

module.exports = logger;
