'use strict';

module.exports = function (_) {
    var extensions = require('swig-extras');
    extensions.useFilter(_.swig, 'markdown');
};
