describe('server module', function(){
    'use strict';

    var expect, vulpes, server, router;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../lib/vulpes');
        server = new vulpes.Server();
        router = new vulpes.Router();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new server object', function () {
            expect(server instanceof vulpes.Server).to.be(true);
        });

        it('can set a router', function () {
            server.set_router(router);
            expect(server.router instanceof vulpes.Router).to.be(true);
            expect(server.router).to.be(router);
        });
    });

    describe('configuring', function () {
        it('sets default configuration', function () {
            expect(server.config).to.eql({
                hostname: '0.0.0.0',
                port: 9000
            });
        });

        it('takes a configuration object', function () {
            server = new vulpes.Server({ hostname: '123' });

            expect(server.config.hostname).to.be('123');
        });

        it('merges default configuration with custom', function () {
            server = new vulpes.Server({ port: 123 });

            expect(server.config).to.eql({
                hostname: '0.0.0.0',
                port: 123
            });
        });
    });
});
