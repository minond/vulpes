'use strict';

var log = require('debug')('serve_views');

module.exports = function serve_views(req, res, next) {
    var file = req.url.substr(1);

    if (!file || file === 'favicon.ico') {
        next();
        return;
    }

    log('handling request for %s', file);
    res.render(file, function (err, html) {
        if (err) {
            next();
        } else {
            log('serving %s', file);
            res.send(html);
        }
    });
};
