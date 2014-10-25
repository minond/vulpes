'use strict';

var postService = require('../services/posts');

module.exports = {
    /**
     * fetches a post from post service and sends in the request
     * @method serve
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    serve: function (req, res, next) {
        postService.fetch(req.params.date, req.params.name, function (err, contents) {
            if (err || !contents) {
                next(err ? err : null);
            } else {
                res.end(contents);
            }
        });
    }
};
