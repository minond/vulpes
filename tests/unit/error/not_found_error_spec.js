describe('not found error', function(){
    'use strict';

    var expect, vulpes, NotFoundError, BaseError, error;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../../lib/vulpes');
        BaseError = vulpes.error.BaseError;
        NotFoundError = vulpes.error.NotFoundError;
        error = new NotFoundError();
    });

    describe('loading module', function () {
        it('allows the instanciation of a new route object', function () {
            expect(error).to.be.a(Error);
            expect(error).to.be.a(BaseError);
            expect(error).to.be.a(NotFoundError);
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
