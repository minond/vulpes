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
     * fetches a post from the file system
     * @method serve
     * @param {String} date (example: 20141025)
     * @param {String} name (example: hello-world)
     * @param {Function} cb
     */
    fetch: function (date, name, cb) {
        var path = this.path(date, name);

        fs.exists(path, function (exists) {
            if (!exists) {
                cb(null, false);
                return;
            }

            fs.readFile(path, function (err, contents) {
                if (err) {
                    cb(err);
                    return;
                }

                cb(null, contents);
            });
        });
    }
};
