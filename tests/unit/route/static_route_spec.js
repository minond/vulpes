describe('controller route', function(){
    'use strict';

    var expect, BaseRoute, StaticRoute, route, vulpes;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../../lib/vulpes');
        BaseRoute = vulpes.route.BaseRoute;
        StaticRoute = vulpes.route.StaticRoute;
        route = new StaticRoute();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(route).to.be.a(BaseRoute);
            expect(route).to.be.a(StaticRoute);
        });
    });

    describe('construction parameters', function () {
        it('sets params from constructor', function () {
            route = new StaticRoute({ url: '/users' });
            expect(route.url).to.be('/users');
        });

        it('defaults to any HTTP method', function () {
            expect(route.method).to.be(BaseRoute.method.ANY);
        });

        it('allows method to be set', function () {
            route = new StaticRoute({ method: BaseRoute.method.PUT });
            expect(route.method).to.be(BaseRoute.method.PUT);
        });

        it('allows base directory to be set', function () {
            route = new StaticRoute({ dir: './public' });
            expect(route.dir).to.be('./public');
        });
    });
});
