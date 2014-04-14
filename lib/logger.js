'use strict';

var cli = require('cli-color'),
    _ = require('lodash'), logger;

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
    var padding = {
        debug: ' ',
        error: ' ',
        info: '  ',
        warn: '  ',
    };

    return logger.template({
        isodate: isodate(),
        padding: padding[ level ],
        level: logger.color[ level ](level.toUpperCase()),
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
    console.log.apply(console, args);
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
    var instance = function () {
        console.log.apply(console, arguments);
    };

    /**
     * @method debug
     * @param {string} [message]*
     */
    instance.debug = log_function(logger.level.DEBUG, name);

    /**
     * @method info
     * @param {string} [message]*
     */
    instance.info = log_function(logger.level.INFO, name);

    /**
     * @method warn
     * @param {string} [message]*
     */
    instance.warn = log_function(logger.level.WARN, name);

    /**
     * @method error
     * @param {string} [message]*
     */
    instance.error = log_function(logger.level.ERROR, name);

    /**
     * reference to art object
     * @property art
     * @type {Object}
     */
    instance.art = logger.art;

    return instance;
}

/**
 * reference to cli object
 * @type {cli-color}
 */
logger.cli = cli;

/**
 * @method template
 * @param {Object} merge_fields
 * @return {string}
 */
logger.template = _.template('${ isodate }${ padding }[${ level }] (${ name }) ${ message }');

/**
 * map with colors by lob level
 * @property color
 * @type {Object}
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
 * @final
 * @type {Object}
 */
logger.level = {
    ART: 'art',
    LINE: 'line',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
};

/**
 * ascii art
 * @property art
 * @type {Object}
 */
logger.art = {
    fox: function (log) {
        log(logger.cli.xterm(232)('                        '));
        log(logger.cli.xterm(254)('     /\\                '));
        log(logger.cli.xterm(222)('    (~(                 '));
        log(logger.cli.xterm(222)('     ) )     /\\_/\\    '));
        log(logger.cli.xterm(222)('    ( _-----_(- -)      '));
        log(logger.cli.xterm(222)('      (       \\ /      '));
        log(logger.cli.xterm(222)('      /|/--\\|\\ V      '));
        log(logger.cli.xterm(244)('      " "   " "         '));
        log(logger.cli.xterm(232)('                        '));
    }
};

module.exports = logger;
