'use strict';

describe('Injector', function () {
    var injector, args, func, ifunc;

    var expect = require('expect.js'),
        Injector = require('../../../lib/injector');

    beforeEach(function () {
        injector = new Injector();
    });

    it('should exist', function () {
        expect(Injector).to.not.be(undefined);
        expect(Injector).to.be.a('function');
        expect(injector instanceof Injector).to.be(true);
    });

    describe('dependency setters and getters', function () {
        it('should be able to set dependencies', function () {
            injector.dependency('one', 1);
        });

        it('should be able to get dependencies', function () {
            injector.dependency('one', 1);
            expect(injector.get_dependency('one')).to.be(1);
        });

        it('unknown dependency return null', function () {
            expect(injector.get_dependency('two')).to.be(null);
        });

        it('returns injector object when setting deps so chaining is possible', function () {
            injector
                .dependency('one', 1)
                .dependency('two', 2)
                .dependency('three', 3)
                .dependency('four', 4);

            expect(injector.get_dependency('one')).to.be(1);
            expect(injector.get_dependency('two')).to.be(2);
            expect(injector.get_dependency('three')).to.be(3);
            expect(injector.get_dependency('four')).to.be(4);
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

        it('recognizes functions with no arguments', function () {
            expect(Injector.get_function_arguments(function () {
                console.log(arguments);
            })).to.eql([]);
        });

        it('handles no matches', function () {
            expect(Injector.get_function_arguments({
                toString: function () {
                    return 'function {}';
                }
            })).to.eql([]);
        });
    });

    describe('argument list generator', function () {
        it('non injector args are not ignored', function () {
            args = injector.generate_argument_list(['one', 'two'], [1, 2]);
            expect(args).to.eql([1, 2]);
        });

        it('extra arguments are not ignored', function () {
            args = injector.generate_argument_list(['one', 'two'], [1, 2, 3, 4]);
            expect(args).to.eql([1, 2]);
        });

        it('injector arguments are included', function () {
            injector.dependency('one', 1);
            args = injector.generate_argument_list(['one'], []);
            expect(args).to.eql([1]);
        });

        it('injector arguments are not overwritten', function () {
            injector.dependency('one', 1);
            args = injector.generate_argument_list(['one'], [2]);
            expect(args).to.eql([1]);
        });

        it('injector arguments can be mixed with regular arguments, manual middle', function () {
            injector.dependency('one', 1);
            injector.dependency('two', 2);
            args = injector.generate_argument_list(['one', 'three', 'two'], [3]);
            expect(args).to.eql([1, 3, 2]);
        });

        it('multiple injector arguments', function () {
            injector.dependency('one', 1);
            injector.dependency('two', 2);
            args = injector.generate_argument_list(['one', 'two'], []);
            expect(args).to.eql([1, 2]);
        });

        it('passing no arguments acts the same', function () {
            args = injector.generate_argument_list(['one', 'two'], []);
            expect(args).to.eql([null, null]);
        });
    });

    describe('bound functions', function () {
        it('valueOf returns the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc.valueOf()).to.be(func.valueOf());
        });

        it('toString returns the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc.toString()).to.be(func.toString());
            expect(ifunc + '').to.be(func + '');
        });

        it('return value is the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc(1)).to.be(func(1));
        });

        it('injector arguments as passed', function () {
            injector.dependency('one', 1);
            injector.dependency('two', 2);
            ifunc = injector.bind(function (one, two) {
                return one + two;
            });

            expect(ifunc()).to.be(3);
        });

        it('can trigger functions', function () {
            injector.dependency('one', 1);
            ifunc = injector.trigger(function (one) {
                return one;
            });

            expect(ifunc).to.be(1);
        });

        it('can trigger functions with a scope', function () {
            injector.dependency('one', 1);
            ifunc = injector.trigger(function (one) {
                return one + this.two;
            }, { two: 2 });

            expect(ifunc).to.be(3);
        });

        it('can trigger functions with a scope by name', function () {
            injector.dependency('one', 1);
            ifunc = injector.trigger('run', {
                two: 2,
                run: function (one) {
                    return one + this.two;
                }
            });

            expect(ifunc).to.be(3);
        });
    });
});
