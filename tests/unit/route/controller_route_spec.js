describe('controller route', function(){
    'use strict';

    var expect, BaseRoute, ControllerRoute, route, vulpes;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../../lib/vulpes');
        BaseRoute = vulpes.route.BaseRoute;
        ControllerRoute = vulpes.route.ControllerRoute;
        route = new ControllerRoute();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(route instanceof BaseRoute).to.be(true);
            expect(route instanceof ControllerRoute).to.be(true);
        });
    });

    describe('construction parameters', function () {
        it('sets params from constructor', function () {
            route = new ControllerRoute({ url: '/users' });
            expect(route.url).to.be('/users');
        });

        it('defaults to any HTTP method', function () {
            expect(route.method).to.be(BaseRoute.method.ANY);
        });

        it('allows method to be set', function () {
            route = new ControllerRoute({ method: BaseRoute.method.PUT });
            expect(route.method).to.be(BaseRoute.method.PUT);
        });

        it('allows controller and action to be set', function () {
            route = new ControllerRoute({
                controller: 'Users',
                action: 'edit'
            });

            expect(route.controller).to.be('Users');
            expect(route.action).to.be('edit');
        });
    });
});
