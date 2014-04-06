describe('server module', function(){
    'use strict';

    var expect, vulpes, server;

    expect = require('expect.js');
    vulpes = require('../lib/vulpes');

    beforeEach(function () {
        server = new vulpes.Server();
    });

    describe('loading module', function () {
        it('allow the instanciation of a new server object', function () {
            expect(true).to.be(true);
        });
    });
});
