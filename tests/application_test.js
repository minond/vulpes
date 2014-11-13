describe('Builder', function () {
    'use strict';

    var app, req, res;

    var map = require('lodash-node/modern/collections/map'),
        noop = require('lodash-node/modern/utilities/noop');

    var expect = require('expect.js'),
        express = require('express'),
        application = require('../src/application');

    beforeEach(function () {
        app = express();

        req = {};
        res = {};

        req.url = 'hihihi';
        res.setHeader = noop;
    });

    describe('#available_in_request', function () {
        it('saves variables on the request object', function () {
            application.available_in_request(app, true, 'hihihi');

            map(app._router.stack, function (middleware) {
                middleware.handle(req, res, noop);
            });

            expect(req.hihihi).to.be(true);
        });
    });
});
