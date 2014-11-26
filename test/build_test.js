describe('Builder', function () {
    'use strict';

    var app, req, res;

    var map = require('lodash-node/modern/collections/map'),
        noop = require('lodash-node/modern/utilities/noop');

    var expect = require('expect.js'),
        express = require('express'),
        swig = require('swig'),
        build = require('../src/build');

    beforeEach(function () {
        app = express();

        req = {};
        res = {};

        req.url = 'hihihi';
        res.setHeader = noop;
    });

    describe('#available_in_request', function () {
        it('saves variables on the request object', function () {
            build.available_in_request(app, true, 'hihihi');

            map(app._router.stack, function (middleware) {
                middleware.handle(req, res, noop);
            });

            expect(req.hihihi).to.be(true);
        });
    });

    describe('#serve_views', function () {
        it('points the views directory to $BASE/assets/views/', function () {
            build.serve_views(app, 'hi');
            expect(app.get('views')).to.be('hi/assets/views/');
        });

        it('caches views', function () {
            build.serve_views(app, 'hi');
            expect(app.get('view cache')).to.be(true);
        });

        it('disables view caching on debug mode', function () {
            build.serve_views(app, 'hi', true);
            expect(app.get('view cache')).to.be(false);
        });

        it('disables swig caching on debug mode', function () {
            build.serve_views(app, 'hi', true);
            expect(app._.swig.options.cache).to.be(false);
        });

        it('tracks the swig instance', function () {
            build.serve_views(app);
            expect(app._.swig).to.be.a(swig.Swig);
        });

        it('creates a new swig instance per app', function () {
            var app1 = express(),
                app2 = express();

            build.serve_views(app1);
            build.serve_views(app2);

            expect(app1._.swig).to.not.equal(app2._.swig);
        });
    });

    // describe('#static_routes', function () {
    //     it('', function () {
    //     });
    // });
});
