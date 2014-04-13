describe('injector module', function () {
    'use strict';

    // copied from https://github.com/minond/DI/blob/master/tests/DI_test.js

    var expect, vulpes, di, Injector, args, func, difunc;

    beforeEach(function () {
        expect = require('expect.js');
        vulpes = require('../../lib/vulpes');
        Injector = vulpes.Injector;
        di = new Injector();
    });

    it('should be an instance of Injector', function () {
        expect(di instanceof Injector).to.be(true);
    });

    describe('dependency setters and getters', function () {
        it('should be able to set dependencies', function () {
            di.dependency('one', 1);
        });

        it('should be able to get dependencies', function () {
            di.dependency('one', 1);
            expect(di.get_dependency('one')).to.be(1);
        });

        it('unknown dependency return null', function () {
            expect(di.get_dependency('two')).to.be(null);
        });

        it('returns di object when setting deps so chaining is possible', function () {
            di
                .dependency('one', 1)
                .dependency('two', 2)
                .dependency('three', 3)
                .dependency('four', 4);

            expect(di.get_dependency('one')).to.be(1);
            expect(di.get_dependency('two')).to.be(2);
            expect(di.get_dependency('three')).to.be(3);
            expect(di.get_dependency('four')).to.be(4);
        });
    });

    describe('function argument parser', function () {
        it('returns empty array when no args are taken', function () {
            expect(Injector.get_function_arguments(function () {})).to.eql([]);
        });

        it('returns array of arguments', function () {
            expect(Injector.get_function_arguments(function (one, two) {
                // just for jshint
                two = one;
            })).to.eql([
                'one', 'two'
            ]);
        });
    });

    describe('argument list generator', function () {
        it('non di args are not ignored', function () {
            args = di.generate_argument_list(['one', 'two'], [1, 2]);
            expect(args).to.eql([1, 2]);
        });

        it('extra arguments are not ignored', function () {
            args = di.generate_argument_list(['one', 'two'], [1, 2, 3, 4]);
            expect(args).to.eql([1, 2]);
        });

        it('di arguments are included', function () {
            di.dependency('one', 1);
            args = di.generate_argument_list(['one'], []);
            expect(args).to.eql([1]);
        });

        it('di arguments are not overwritten', function () {
            di.dependency('one', 1);
            args = di.generate_argument_list(['one'], [2]);
            expect(args).to.eql([1]);
        });

        it('di arguments can be mixed with regular arguments, manual middle', function () {
            di.dependency('one', 1);
            di.dependency('two', 2);
            args = di.generate_argument_list(['one', 'three', 'two'], [3]);
            expect(args).to.eql([1, 3, 2]);
        });

        it('multiple di arguments', function () {
            di.dependency('one', 1);
            di.dependency('two', 2);
            args = di.generate_argument_list(['one', 'two'], []);
            expect(args).to.eql([1, 2]);
        });

        it('passing no arguments acts the same', function () {
            args = di.generate_argument_list(['one', 'two'], []);
            expect(args).to.eql([null, null]);
        });
    });

    describe('bound functions', function () {
        it('valueOf returns the same', function () {
            func = function (num) {
                return num;
            };

            difunc = di.bind(func);
            expect(difunc.valueOf()).to.be(func.valueOf());
        });

        it('toString returns the same', function () {
            func = function (num) {
                return num;
            };

            difunc = di.bind(func);
            expect(difunc.toString()).to.be(func.toString());
            expect(difunc + '').to.be(func + '');
        });

        it('return value is the same', function () {
            func = function (num) {
                return num;
            };

            difunc = di.bind(func);
            expect(difunc(1)).to.be(func(1));
        });

        it('di arguments as passed', function () {
            di.dependency('one', 1);
            di.dependency('two', 2);
            difunc = di.bind(function (one, two) {
                return one + two;
            });

            expect(difunc()).to.be(3);
        });

        it('can trigger functions', function () {
            di.dependency('one', 1);
            difunc = di.trigger(function (one) {
                return one;
            });

            expect(difunc).to.be(1);
        });

        it('can trigger functions with a scope', function () {
            di.dependency('one', 1);
            difunc = di.trigger(function (one) {
                return one + this.two;
            }, { two: 2 });

            expect(difunc).to.be(3);
        });

        it('can trigger functions with a scope by name', function () {
            di.dependency('one', 1);
            difunc = di.trigger('run', {
                two: 2,
                run: function (one) {
                    return one + this.two;
                }
            });

            expect(difunc).to.be(3);
        });
    });
});
