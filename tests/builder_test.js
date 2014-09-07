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

        it('takes custom configuration', function () {
            builder = new Builder({ hi: true });
            expect(builder.config.hi).to.be(true);
        });

        it('takes the current working directory', function () {
            builder = new Builder(null, 'hi');
            expect(builder.cwd).to.be('hi');
        });

        it('defaults the cwd to the actual cwd', function () {
            expect(builder.cwd).to.be(process.cwd());
        });
    });

    describe('#routes', function () {
        it('does not require a method', function () {
            expect(builder.routes({
                '/': {}
            })[0].method).to.be(builder.config.controllers.defaults.method);
        });

        it('does not require an action', function () {
            expect(builder.routes({
                '/': {}
            })[0].action).to.be(builder.config.controllers.defaults.action);
        });

        it('takes a method', function () {
            expect(builder.routes({
                '/': {
                    method: 'post'
                }
            })[0].method).to.be('post');
        });

        it('takes an action', function () {
            expect(builder.routes({
                '/': {
                    action: 'hi'
                }
            })[0].action).to.be('hi');
        });

        it('does not change the url', function () {
            expect(builder.routes({
                '/hi/bye': {}
            })[0].url).to.be('/hi/bye');
        });

        it('merges the controller into a file path', function () {
            builder = new Builder({}, 'here');

            expect(builder.routes({
                '/': {
                    controller: 'mycontroller'
                }
            })[0].controller).to.be('here/app/controllers/mycontroller.js');
        });
    });
});
