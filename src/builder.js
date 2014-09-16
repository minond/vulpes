'use strict';

var format = require('util').format,
    map = require('lodash-node/modern/collections/map');

/**
 * a vulpes app runtime builder
 * @class Builder
 * @param {acm} config
 */
function Builder(config) {
    this.$config = config;
}

/**
 * combines all parts of the build into a single object
 * @method build
 * @return {Object}
 */
Builder.prototype.build = function () {
    return {
        routes: this.routes()
    };
};

/**
 * takes an object representation of the application's routes and returns an
 * list of urls and their handler methods
 * @return {Array}
 */
Builder.prototype.routes = function () {
    return {
        static: map(this.$config.get('routes.static'), function (dir, url) {
            return {
                url: url,
                dir: dir
            };
        }),
        dynamic: map(this.$config.get('routes.routes'), function (route, url) {
            return {
                url: url,
                method: route.method || this.$config.get('controllers.controllers.defaults.method'),
                action: route.action || this.$config.get('controllers.controllers.defaults.action'),
                controller: format(this.$config.get('structure.structure.server.controllers'), route.controller),
                controller_name: route.controller
            };
        }, this)
    };
};

module.exports = Builder;
