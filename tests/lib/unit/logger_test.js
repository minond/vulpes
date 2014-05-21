'use strict';

describe('logger module', function () {
    var log, template;

    var expect = require('expect.js'),
        lodash = require('lodash'),
        logger = require('../../../lib/logger');

    /**
     * returns whatever it gets
     */
    var in_out = function (arg) {
        return arg;
    };

    // no colors
    logger.color.debug = in_out;
    logger.color.error = in_out;
    logger.color.info = in_out;
    logger.color.warn = in_out;

    beforeEach(function () {
        log = logger('test');
    });

    describe('log return value', function () {
        it('should be a function', function () {
            expect(log).to.be.a('function');
        });

        it('should have level functions', function () {
            expect(log.debug).to.be.a('function');
            expect(log.error).to.be.a('function');
            expect(log.info).to.be.a('function');
            expect(log.warn).to.be.a('function');
        });

        it('should have access to the colors object', function () {
            expect(logger.color.debug).to.be.an('function');
            expect(logger.color.error).to.be.an('function');
            expect(logger.color.info).to.be.an('function');
            expect(logger.color.warn).to.be.an('function');
        });

        it('should have access to the template function', function () {
            expect(logger.template).to.be.a('function');
        });
    });

    describe('fields', function () {
        it('isodate', function () {
            var output;

            template = lodash.template('${ isodate }');
            output = logger.line(template);

            expect(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(output))
                .to.be(true);
        });

        it('levels', function () {
            template = lodash.template('${ level }');
            expect(logger.line(template)).to.be('INFO');
            expect(logger.line(template, logger.level.DEBUG)).to.be('DEBUG');
            expect(logger.line(template, logger.level.ERROR)).to.be('ERROR');
            expect(logger.line(template, logger.level.INFO)).to.be('INFO');
            expect(logger.line(template, logger.level.WARN)).to.be('WARN');
        });
    });

    describe('generator', function () {
        it('creates new log functions', function () {
            expect(logger.generate()).to.be.a('function');
        });

        it('calls the provided console.log function', function () {
            var called = false,
                newlog = logger.generate(logger.level.INFO, 'test', function () {
                    called = true;
                });

            newlog('hihihi');
            expect(called).to.be(true);
        });
    });
});
