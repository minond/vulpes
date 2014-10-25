'use strict';

module.exports = {
    dump: function dump(req, res) {
        res.render('basic/dump', {
            routes: req.config.get('routes'),
            route: req.route,
            headers: req.headers,
            request: {
                params: req.params,
                query: req.query,
            },
        });
    }
};
