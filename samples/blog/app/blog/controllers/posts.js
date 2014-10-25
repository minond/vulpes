'use strict';

var fs = require('fs'),
    join = require('path').join,
    format = require('util').format;

module.exports = {
    /**
     * takes a date string and a post name and generates a post file path
     * @method path
     * @param {String} date (example: 20141025)
     * @param {String} name (example: hello-world)
     * @return {String} (example: /home/blog/posts/2014-10-25-hello-world.md)
     */
    path: function (date, name) {
        var file = format('%s-%s.md', date
            .match(/(\d{4})(\d{2})(\d{2})/)
            .filter(function (d, i) { return i; })
            .join('-'), name);

        return join(process.cwd(), 'posts', file);
    },

    /**
     * fetches a post from the file system and sends in the request
     * @method serve
     * @param {http.Request} req
     * @param {http.Response} res
     * @param {Function} next
     */
    serve: function (req, res, next) {
        var path = this.path(req.params.date, req.params.name);

        fs.exists(path, function (exists) {
            if (!exists) {
                next();
                return;
            }

            fs.readFile(path, function (err, contents) {
                if (err) {
                    next(err);
                    return;
                }

                res.end(contents);
            });
        });
    }
};
