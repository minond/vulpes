describe('Builder', function () {
    'use strict';

    var Builder, builder, expect;

    beforeEach(function () {
        expect = require('expect.js');
        Builder = require('../src/builder');
        builder = new Builder();
    });

    describe('#constructor', function () {
        it('can be instanciated', function () {
            expect(builder).to.be.a(Builder);
        });
    });
});
