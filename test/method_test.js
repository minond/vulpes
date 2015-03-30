'use strict';

import assert from 'assert';
import method from '../build/src/method';

import Blog from './artifacts/app/blog';

describe('method', () => {
    var handler;

    it('loads the controller', () => {
        handler = method('test/artifacts/app/blog.serve');
        assert(handler instanceof Function);
    });

    it('binds static methods to the controller', () => {
        handler = method('test/artifacts/app/blog.serve');
        assert(handler() === Blog);
    });

    it('binds methods to an instance of the controller', () => {
        handler = method('test/artifacts/app/blog.cache');
        assert(handler() instanceof Blog);
    });

    it('only creates one instance of a controller', () => {
        handler = [
            method('test/artifacts/app/blog.cache'),
            method('test/artifacts/app/blog.cache')
        ];

        assert(handler[0]() === handler[1]());
    });
});
