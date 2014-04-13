describe('base route', function(){
    'use strict';

    var expect, BaseRoute, route, vulpes, url, req;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../../lib/vulpes');
        BaseRoute = vulpes.route.BaseRoute;
        route = new BaseRoute();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(route).to.be.a(BaseRoute);
        });
    });

    describe('construction parameters', function () {
        it('sets params from constructor', function () {
            route = new BaseRoute({ url: '/users' });
            expect(route.url).to.be('/users');
        });

        it('defaults to any HTTP method', function () {
            expect(route.method).to.be(BaseRoute.method.ANY);
        });

        it('allows method to be set', function () {
            route = new BaseRoute({ method: BaseRoute.method.PUT });
            expect(route.method).to.be(BaseRoute.method.PUT);
        });
    });

    describe('url compilcation', function () {
        it('adds start and end characters', function () {
            url = BaseRoute.compile_template_url('/users');
            expect(url).to.eql(new RegExp('^/users$'));
        });
    });

    describe('handler check', function () {
        it('allows wildcard methods', function () {
            route = new BaseRoute({
                url: '/users',
                method: BaseRoute.method.ANY
            });

            req = {
                url: '/users',
                method: BaseRoute.method.PUT
            };

            expect(route.handles(req)).to.be(true);
        });

        it('compares method', function () {
            route = new BaseRoute({
                url: '/users',
                method: BaseRoute.method.POST
            });

            req = {
                url: '/users',
                method: BaseRoute.method.GET
            };

            expect(route.handles(req)).to.be(false);
        });
    });

    describe('route handler', function () {
        it('should not route anything', function () {
            expect(route.route).to.throwError(function (e) {
                expect(e).to.be.a(Error);
            });
        });
    });
});
