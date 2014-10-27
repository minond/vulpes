'use strict';

var POST_INFO_EXTRACT = /(\d{4}-\d{2}-\d{2})-(.+)\.md/,
    POST_DATE_REFORMAT = /(\d{4})(\d{2})(\d{2})/;

var fs = require('fs'),
    join = require('path').join,
    format = require('util').format;

module.exports = {
    /**
     * @method is_post
     * @param {String} file
     * @return {Boolean}
     */
    is_post: function postsServiceIsPost(file) {
        return file.substr(-3) === '.md';
    },

    /**
     * @method gen_path
     * @param {String} date (example: 20141025)
     * @param {String} name (example: hello-world)
     * @return {String} (example: /home/blog/posts/2014-10-25-hello-world.md)
     */
    gen_path: function postsServiceGeneratePath(date, name) {
        var file = format('%s-%s.md', date
            .match(POST_DATE_REFORMAT)
            .filter(function (d, i) { return i; })
            .join('-'), name);

        return join(process.cwd(), 'posts', file);
    },

    /**
     * @method gen_info
     * @param {String} file name
     * @return {Object} (example: { name: "hello world", date: Date }
     */
    gen_info: function postsServiceGenerateName(file) {
        var parts = file.match(POST_INFO_EXTRACT),
            info = {};

        if (parts && parts.length) {
            info.date = new Date(parts[1]);
            info.name = parts[2];
            info.link = format('/p/%s/%s', parts[1].replace(/-/g, ''), info.name);
        }

        return info;
    },

    /**
     * finds all posts and passed them to the callback
     * @method list
     * @param {Function} cb
     */
    list: function postsServiceList(cb) {
        var me = this;
        fs.readdir(join(process.cwd(), 'posts'), function (err, posts) {
            if (err) {
                cb(err);
            } else {
                cb(null, posts.filter(me.is_post).map(me.gen_info));
            }
        });
    },

    /**
     * fetches a post from the file system
     * @method serve
     * @param {String} date (example: 20141025)
     * @param {String} name (example: hello-world)
     * @param {Function} cb
     */
    fetch: function postsServiceFetch(date, name, cb) {
        var path = this.gen_path(date, name);

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
