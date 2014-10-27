'use strict';

var postService = require('../services/posts');

module.exports = {
    /**
     * renders all posts
     * @method serve
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    list: function (req, res, next) {
        postService.list(function (err, posts) {
            if (err) {
                next(err);
            } else {
                res.format({
                    html: function () {
                        res.render('blog/welcome', { posts: posts });
                    }
                });
            }
        });
    },

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
                    html: function () {
                        res.render('blog/post', {
                            content: content.toString()
                        });
                    }
                });
            }
        });
    }
};
