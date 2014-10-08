'use strict';

var color = require('cli-color');
console.log(color.xterm(232)('                        '));
console.log(color.xterm(254)('     /\\                '));
console.log(color.xterm(222)('    (~(                 '));
console.log(color.xterm(222)('     ) )     /\\_/\\    '));
console.log(color.xterm(222)('    ( _-----_(- -)      '));
console.log(color.xterm(222)('      (       \\ /      '));
console.log(color.xterm(222)('      /|/--\\|\\ V      '));
console.log(color.xterm(244)('      " "   " "         '));
console.log(color.xterm(232)('                        '));

var builder, build, config;

var Configuration = require('acm'),
    Builder = require('../src/builder');

var app = require('express')(),
    log = require('debug')('vulpes:server'),
    path = require('path'),
    cwd = process.cwd();

config = new Configuration({
    paths: [
        path.join(cwd, 'config'),
        path.join(__dirname, '..', 'config'),
    ]
});

config.fields.cwd = cwd;
builder = new Builder(config);
build = builder.build();

// should not require any middle ware
build.routes.static.forEach(function (route) {
    log('static route %s (%s)', route.url, route.dir);
    app.use(route.url, require('serve-static')(route.dir));
});

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());
app.use(require('cookie-parser')(/* secret */));

app.set('view engine', 'html');
app.set('views', cwd + '/assets/views/');
app.engine('html', require('swig').renderFile);

// application routes
build.routes.dynamic.forEach(function (route) {
    log('dynamic route %s (%s#%s)', route.url, route.controller_name, route.action);
    var controller = require(route.controller);
    app[ route.method ](route.url, controller[ route.action ]);
});

if (process.env.NODE_ENV === 'development') {
    log('detected development enviroment');
    require('swig').setDefaults({ cache: false });
    require('errorhandler').title = 'Vulpes';

    build.routes.static.forEach(function (route) {
        log('serving index %s (%s)', route.url, route.dir);
        app.use(route.url, require('serve-index')(route.dir));
    });

    app.set('view cache', false);
    app.use(require('errorhandler')());
}

app.get('*', require('../src/middleware/serve_views.js'));
app.get('*', require('../src/middleware/not_found.js'));
app.listen(process.env.PORT || 5000);
