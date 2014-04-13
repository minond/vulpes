'use strict';

/**
 * all of vulpes' "public" modules
 * @module vulpes
 */

module.exports.Server = require('./server');
module.exports.Router = require('./router');

module.exports.route = {
    BaseRoute: require('./route/base_route'),
    StaticRoute: require('./route/static_route'),
    ControllerRoute: require('./route/controller_route'),
};

module.exports.error = {
    BaseError: require('./error/base_error'),
    NotFoundError: require('./error/not_found_error'),
};
