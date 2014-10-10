'use strict';

var app = require('express')(),
    log = require('debug')('vulpes:server'),
    config = require('acm');

var join = require('path').join,
    format = require('util').format,
    filter = require('lodash-node/modern/collections/filter'),
    map = require('lodash-node/modern/collections/map');

config.$paths.push(join(__dirname, '..', 'config'));

// define static files first. should not require middleware
map(config.get('routes.=static'), function (dir, url) {
    log('static route %s (%s)', url, dir);
    app.use(url, require('serve-static')(dir));
});

app.set('view engine', 'html');
app.set('views', process.cwd() + '/assets/views/');
app.engine('html', require('swig').renderFile);
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.use(require('cookie-parser')(config.get('application.cookies.secret')));

// application routes
map(filter(config.get('routes'), function (route, url) {
    route.url = url;
    return url[0] !== '=';
}), function (route) {
    var method = route.method || config.get('structure.controllers.method'),
        action = route.action || config.get('structure.controllers.action'),
        controller = require(format(config.get('structure.server.controllers'), route.controller));

    log('dynamic route %s (%s#%s)', route.url, route.controller, action);
    app[ method ](route.url, controller[ action ]);
});

if (process.env.NODE_ENV === 'development') {
    log('detected development enviroment');
    require('swig').setDefaults({ cache: false });
    require('errorhandler').title = 'Vulpes';

    map(config.get('routes.=static'), function (dir, url) {
        log('serving index %s (%s)', url, dir);
        app.use(url, require('serve-index')(dir));
    });

    app.set('view cache', false);
    app.use(require('errorhandler')());
}

app.use(require('pageview')(app.get('views')));
app.use(require('not-found')(app.get('views') + '404.html'));
app.listen(process.env.PORT || 5000);
