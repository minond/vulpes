'use strict';

describe('server module', function () {
    var server;

    var expect = require('expect.js'),
        events = require('events'),
        vulpes = require('../../../lib');

    var Server = vulpes.Server;

    beforeEach(function () {
        server = new Server();

        // no logging
        server.log = function () {};
        server.log.info = function () {};
    });

    afterEach(function () {
        if (server.server) {
            server.server.close();
        }
    });

    it('should exist', function () {
        expect(Server).to.not.be(undefined);
        expect(Server).to.be.a('function');
        expect(server instanceof Server).to.be(true);
        expect(server instanceof events.EventEmitter).to.be(true);
    });

    describe('properties', function () {
        it('starts out with no router', function () {
            expect(server.router).to.be(null);
        });

        it('starts out with no server', function () {
            expect(server.server).to.be(null);
        });
    });

    describe('configuration', function () {
        describe('defaults', function () {
            it('sets the hostname', function () {
                expect(server.config.hostname).to.be(Server.DEFAULTS.hostname);
            });

            it('sets the port', function () {
                expect(server.config.port).to.be(Server.DEFAULTS.port);
            });

            it('has what we think it has', function () {
                expect(server.config).to.eql({
                    port: Server.DEFAULTS.port,
                    hostname: Server.DEFAULTS.hostname
                });
            });
        });

        describe('custom', function () {
            it('sets the hostname', function () {
                server = new Server({ hostname: 'hi' });
                expect(server.config.hostname).to.be('hi');
            });

            it('sets the port', function () {
                server = new Server({ port: 1 });
                expect(server.config.port).to.be(1);
            });
        });

        describe('events', function () {
            it('triggers `start` event', function () {
                var called = false;
                var flag = function () {
                    called = true;
                };

                server.config.port = 1234;
                server.router = {};

                server.on('start', flag);
                server.start();
                expect(called).to.be(true);
            });
        });
    });
});
