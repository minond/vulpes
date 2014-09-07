'use strict';

var lodash = require('lodash'),
    yaml = require('yamljs');

/**
 * @function deep_defaults
 */
var deep_defaults = lodash.partialRight(
    lodash.merge,
    function deep(value, other) {
        return lodash.merge(value, other, deep);
    }
);

/**
 * a vulpes app runtime builder
 * @class Builder
 * @param {Object} config
 * @param {String} cwd
 */
function Builder(config, cwd) {
    this.cwd = cwd || process.cwd();
    this.config = deep_defaults({
        structure: yaml.load(__dirname + '/../config/structure.yml').structure,
        controllers: yaml.load(__dirname + '/../config/controllers.yml').controllers
    }, config);
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

    return lodash.map(routes, function (route, url) {
        return {
            url: url,
            method: route.method || config.controllers.defaults.method,
            action: route.action || config.controllers.defaults.action,
            controller: lodash.template(config.structure.server.controllers, {
                cwd: cwd,
                name: route.controller
            })
        };
    });
};

module.exports = Builder;
