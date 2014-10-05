'use strict';

var log = require('debug')('notfound');

module.exports = function not_found(req, res, next) {

    log('404\'ing request to %s', req.url);
    res.render(404, function (err, html) {
        if (err) {
            next();
        } else {
            res.status(404);
            res.send(html);
        }
    });
};
