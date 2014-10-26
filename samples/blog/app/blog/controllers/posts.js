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
        postService.fetch(req.params.date, req.params.name, function (err, content) {
            if (err || !content) {
                next(err ? err : null);
            } else {
                res.format({
                    text: function () {
                        res.end(content);
                    },

                    html: function () {
                        res.render('blog/post', {
                            content: content.toString()
                        });
                    },

                    json: function () {
                        res.json({
                            name: req.params.name,
                            date: req.params.date,
                            content: content.toString()
                        });
                    }
                });
            }
        });
    }
};
