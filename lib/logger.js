'use strict';

var cli = require('cli-color'),
    _ = require('lodash'), logger;

/**
 * @function field_isodate
 * @return {string} ISO formatted date
 */
function field_isodate() {
    var d = new Date();
    return d.toISOString();
}

/**
 * @function field_padding
 * @param {string} level
 * @return {string}
 */
function field_padding(level) {
    var padding = {
        debug: ' ',
        error: ' ',
        info: '  ',
        warn: '  ',
    };

    return padding[ level ];
}

/**
 * @function field_level
 * @param {string} level
 * @return {string}
 */
function field_level(level) {
    return logger.color[ level ](level.toUpperCase());
}

/**
 * returns a logger function
 * @function generate_log_function
 * @param {string} level
 * @param {string} name
 * @return {Function}
 */
function generate_log_function (level, name) {
    return function () {
        var args = _.tail(arguments);
        var message = _.first(arguments);
        var log = logger.create_log_string(
            logger.template, level, name, message);

        args.unshift(log);
        console.log.apply(console, args);
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
    var instance = console.log.bind(console);

    /**
     * @method debug
     * @param {string} [message]*
     */
    instance.debug = generate_log_function(logger.level.DEBUG, name);

    /**
     * @method info
     * @param {string} [message]*
     */
    instance.info = generate_log_function(logger.level.INFO, name);

    /**
     * @method warn
     * @param {string} [message]*
     */
    instance.warn = generate_log_function(logger.level.WARN, name);

    /**
     * @method error
     * @param {string} [message]*
     */
    instance.error = generate_log_function(logger.level.ERROR, name);

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
 * @static
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

/**
 * @method create_log_string
 * @static
 * @param {Function} template
 * @param {string} level
 * @param {string} name
 * @param {string} message
 */
logger.create_log_string = function (template, level, name, message) {
    return template({
        isodate: field_isodate(),
        padding: field_padding(level),
        level: field_level(level),
        message: message,
        name: name,
    });
};

module.exports = logger;
