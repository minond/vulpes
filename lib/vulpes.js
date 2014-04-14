'use strict';

/**
 * all of vulpes' "public" modules
 * @module vulpes
 */

// methods and objects
module.exports.std = require('./std');
module.exports.util = require('./util');
module.exports.logger = require('./logger');

// constructors
module.exports.Server = require('./server');
module.exports.Router = require('./router');
module.exports.Injector = require('./injector');

// route constructors
module.exports.route = {
    BaseRoute: require('./route/base_route'),
    StaticRoute: require('./route/static_route'),
    ControllerRoute: require('./route/controller_route'),
};

// error constructors
module.exports.error = {
    BaseError: require('./error/base_error'),
    NotFoundError: require('./error/not_found_error'),
};
