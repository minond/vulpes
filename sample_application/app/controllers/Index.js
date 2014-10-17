'use strict';

module.exports = {
    dump: function dump(req, res) {
        res.render('dump', {
            routes: JSON.stringify(req.config.get('routes'), null, '  '),
            route: JSON.stringify(req.route, null, '  '),
            headers: JSON.stringify(req.headers, null, '  '),
            request: JSON.stringify({
                params: req.params,
                query: req.query,
            }, null, '  '),
        });
    }
};
