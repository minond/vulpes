/**
 * no need to edit this file. configured by config/build.yml
 * http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
 */
module.exports = function (grunt) {
    'use strict';

    var DEFAULT_CONFIG = 'vendor/minond/scaffold/config/build.yml';
    var LOCAL_CONFIG = 'config/build.yml';

    var _ = require('lodash');
    var glob = require('glob');
    var defaults = require('merge-defaults');

    var tasks = {};
    var config = defaults(
        grunt.file.exists(LOCAL_CONFIG) ? grunt.file.readYAML(LOCAL_CONFIG) : {},
        grunt.file.readYAML(DEFAULT_CONFIG)
    );

    tasks.config = config;
    tasks.pkg = grunt.file.readJSON('package.json');

    // options
    grunt.initConfig(tasks);
    _(config.options).each(function (path) {
        glob.sync('*.js', { cwd: path }).forEach(function (option) {
            var task = option.replace(/\.js$/,'');
            var definition = require(path + option);

            tasks[ task ] = _.isFunction(definition) ?
                definition(grunt, config) : definition;
        });
    });

    // tasks
    require('load-grunt-tasks')(grunt);
    _(config.aliases).forOwn(function (tasks, alias) {
        grunt.registerTask(alias, tasks);
    });
};
