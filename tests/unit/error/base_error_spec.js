describe('base error', function(){
    'use strict';

    var expect, vulpes, BaseError, error;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../../lib/vulpes');
        BaseError = vulpes.error.BaseError;
        error = new BaseError();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(error).to.be.a(Error);
            expect(error).to.be.a(BaseError);
        });
    });

    describe('construction parameters', function () {
        it('sets params from constructor', function () {
            error = new BaseError('hi');
            expect(error.message).to.be('hi');
        });

        it('has a stack', function () {
            expect(error.stack).to.be.a('string');
        });
    });
});
