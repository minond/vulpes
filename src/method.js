'use strict';

import {join} from 'path';

/**
 * @param {Object} Controller
 * @param {String} method
 * @return {Object}
 */
function holder(Controller, method) {
    if (!Controller.$$instance) {
        Controller.$$instance = new Controller();
    }

    return method in Controller ? Controller : Controller.$$instance;
}

/**
 * @param {Object} controller
 * @param {String} method
 * @return {Fuction}
 */
function bound(controller, method) {
    return controller[method].bind(controller);
}

/**
 * @param {String} handler (example: blog/controllers/posts.update)
 * @param {String} source_dir (default: '')
 * @param {String} file_extension (default: '.js')
 * @return {Function} route handler
 */
export default function (handler, source_dir = '', file_extension = '.js') {
    let parts = handler.split('.'),
        file = parts[0],
        method = parts[1];

    let path = join(process.cwd(), source_dir, file + file_extension),
        controller = holder(require(path).default, method);

    return bound(controller, method);
}
