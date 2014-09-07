'use strict';

var _ = require('lodash'),
    yaml = require('yamljs');

/**
 * @function merge
 */
var merge = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
});

/**
 * all of vulpe's default configuration
 * @type {Object}
 */
var default_config = merge(
    yaml.load(__dirname + '/../config/structure.yml'),
    yaml.load(__dirname + '/../config/controllers.yml')
);

/**
 * a vulpes app runtime builder
 * @class Builder
 * @param {Object} config
 * @param {String} cwd
 */
function Builder(config, cwd) {
    this.cwd = cwd || process.cwd();
    this.config = merge(default_config, config);
}

/**
 * takes an object representation of the application's routes and returns an
 * list of urls and their handler methods
 * @param {Object} routes
 * @return {Array}
 */
Builder.prototype.routes = function (routes) {
    var config = this.config,
        cwd = this.cwd;

    return _.map(routes, function (route, url) {
        return {
            url: url,
            method: route.method || config.controllers.defaults.method,
            action: route.action || config.controllers.defaults.action,
            controller: _.template(config.structure.server.controllers, {
                cwd: cwd,
                name: route.controller
            })
        };
    });
};

module.exports = Builder;
