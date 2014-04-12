describe('server module', function(){
    'use strict';

    var expect, Route, route, vulpes, url, req;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../lib/vulpes');
        Route = vulpes.Route;
        route = new vulpes.Route();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(route instanceof Route).to.be(true);
        });
    });

    describe('construction parameters', function () {
        it('sets params from constructor', function () {
            route = new Route({ url: '/users' });
            expect(route.url).to.be('/users');
        });

        it('is not static by default', function () {
            route = new Route();
            expect(route.is_static).to.be(false);
        });

        it('allows static flag to be set', function () {
            route = new Route({ static: true });
            expect(route.is_static).to.be(true);
        });

        it('defaults to any HTTP method', function () {
            expect(route.method).to.be(Route.method.ANY);
        });

        it('allows method to be set', function () {
            route = new Route({ method: Route.method.PUT });
            expect(route.method).to.be(Route.method.PUT);
        });
    });

    describe('url compilcation', function () {
        it('adds start and end characters', function () {
            url = Route.compile_template_url('/users');
            expect(url).to.eql(new RegExp('^/users$'));
        });
    });

    describe('handler check', function () {
        it('allows wildcard methods', function () {
            route = new Route({
                url: '/users',
                method: Route.method.ANY
            });

            req = {
                url: '/users',
                method: Route.method.PUT
            };

            expect(route.handles(req)).to.be(true);
        });

        it('compares method', function () {
            route = new Route({
                url: '/users',
                method: Route.method.POST
            });

            req = {
                url: '/users',
                method: Route.method.GET
            };

            expect(route.handles(req)).to.be(false);
        });
    });
});
