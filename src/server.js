'use strict';

var app = require('express')();

var Configuration = require('acm'),
    log = require('debug')('vulpes:server'),
    path = require('path'),
    map = require('lodash-node/modern/collections/map'),
    format = require('util').format,
    cwd = process.cwd();

var config = new Configuration({
    paths: [
        path.join(cwd, 'config'),
        path.join(__dirname, '..', 'config'),
    ]
});

config.fields.cwd = cwd;

// should not require any middle ware
map(config.get('routes.static'), function (dir, url) {
    log('static route %s (%s)', url, dir);
    app.use(url, require('serve-static')(dir));
});

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.use(require('cookie-parser')(/* secret */));

app.set('view engine', 'html');
app.set('views', cwd + '/assets/views/');
app.engine('html', require('swig').renderFile);

// application routes
map(config.get('routes.routes'), function (route, url) {
    var method = route.method || config.get('controllers.controllers.defaults.method'),
        action = route.action || config.get('controllers.controllers.defaults.action'),
        controller = require(format(config.get('structure.structure.server.controllers'), route.controller));

    log('dynamic route %s (%s#%s)', url, route.controller, action);
    app[ method ](url, controller[ action ]);
});

if (process.env.NODE_ENV === 'development') {
    log('detected development enviroment');
    require('swig').setDefaults({ cache: false });
    require('errorhandler').title = 'Vulpes';

    map(config.get('routes.static'), function (dir, url) {
        log('serving index %s (%s)', url, dir);
        app.use(url, require('serve-index')(dir));
    });

    app.set('view cache', false);
    app.use(require('errorhandler')());
}

app.use(require('pageview')(app.get('views')));
app.use(require('not-found')(app.get('views') + '404.html'));
app.listen(process.env.PORT || 5000);
