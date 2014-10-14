'use strict';

module.exports = {
    greet: function (req, res) {
        res.send('hello, ' + (req.params.name || 'world'));
    }
};
