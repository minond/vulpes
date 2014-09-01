'use strict';

var express = require('express'),
    debug = require('debug'),
    index = require('serve-index'),
    body = require('body-parser'),
    swig = require('swig'),
    fs = require('fs');

var app = express(),
    cwd = process.cwd(),
    log = debug('vulpes:server');

/**
 * loads a project configuration file and passed it the application instance
 *
 * @internal
 * @function load
 * @param {String} file
 */
function load (file) {
    if (fs.existsSync(cwd + '/config/' + file + '.js')) {
        log('loading application ' + file + ' file');
        require(cwd + '/config/' + file + '.js')(app);
    }
}

app.use(body.urlencoded({ extended: false }))
app.use(body.json())
app.use('/lib', express.static(cwd + '/lib/'));
app.use('/assets', express.static(cwd + '/assets/'));
app.set('view engine', 'html');
app.set('views', cwd + '/assets/views/');
app.engine('html', swig.renderFile);

if (process.env.NODE_ENV === 'development') {
    app.use('/lib', index(cwd + '/lib/', { icons: true }))
    app.use('/assets', index(cwd + '/assets/', { icons: true }))
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

load('bootup');
load('routes');

app.get('/*', function (req, res) {
    res.render(req.url.replace(/^\//, '') + '.html');
});

app.listen(process.env.PORT);
