describe('utilities', function(){
    'use strict';

    var expect, vulpes, util;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../lib/vulpes');
        util = vulpes.util;
    });

    describe('string functions', function () {
        it('converts camel case to underscore case', function () {
            expect(util.str.camel_to_underscore('MyUsers')).to.be('my_users');
        });

        it('does not add an underscore when capital letter follows a non alpha character', function () {
            expect(util.str.camel_to_underscore('/MyUsers')).to.be('/my_users');
        });
    });
});
