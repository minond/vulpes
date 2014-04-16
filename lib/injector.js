'use strict';

// copied from https://github.com/minond/DI/blob/master/src/DI.js

/**
 * @class Injector
 * @constructor
 */
var Injector = function Injector () {
    /**
     * holds all dependencies. keyed by dep name
     * @property deps
     * @type {Object}
     */
    this.deps = {};
};

/**
 * add a new dependency that can be injected
 * @chainable
 * @method dependency
 * @param {string} name they name of the dependency variable
 * @param {mixed} dep the actual dependency variable that will be passed
 * @return {Injector} own instance
 */
Injector.prototype.dependency = function (name, dep) {
    this.deps[ name ] = dep;
    return this;
};

/**
 * get a dependency by its name
 * @method get_dependency
 * @param {string} name dependency di name. ie. $Ajax
 * @return {mixed} the actual dependency variable
 */
Injector.prototype.get_dependency = function (name) {
    return name in this.deps ? this.deps[ name ] : null;
};

/**
 * make a function dependency-injectable
 * @method bind
 * @param {Function} func function that you want to Injector'ify
 * @param {Object} scope bound to `this`
 * @return {Function} the new function that is dependency-injectable. returned
 * function looks almost like the passed argument, but not exactly. one of the
 * differences is that the `length` property will always be zero.
 */
Injector.prototype.bind = function (func, scope) {
    var copy, that, args, arglen;

    that = this;
    args = Injector.get_function_arguments(func);
    arglen = args.length;

    copy = function () {
        return func.apply(scope,
            that.generate_argument_list(args,
                Array.prototype.splice.call(arguments, 0)));
    };

    copy.valueOf = function () {
        return func.valueOf();
    };

    copy.toString = function () {
        return func.toString();
    };

    return copy;
};

/**
 * creates and triggers a di function
 * @param {string|Function} func
 * @param {Object} scope
 */
Injector.prototype.trigger = function (func, scope) {
    func = func instanceof Function ? func : scope[ func ];
    return this.bind(func, scope)();
};

/**
 * takes an array of arguments that were passed to a Injector'ifyed function
 * and returns another array of arguments that should should be used instead
 * @method generate_argument_list
 * @param {Array} arglist original list of function arguments
 * @param {Array} callargs array of arguments that were pass to function
 * @return {Array} array of parameters that should be passed to function
 */
Injector.prototype.generate_argument_list = function (arglist, callargs) {
    var dicount, callcount, arg, calllen, arglen, diargs;

    calllen = callargs.length;
    arglen = arglist.length;
    diargs = [];
    dicount = 0;
    callcount = 0;

    for (; dicount < arglen; dicount++) {
        arg = arglist[ dicount ];

        if (this.is_di_argument(arg)) {
            // auto di argument
            arg = this.get_dependency(arg);
        } else if (callcount < calllen) {
            // manually pass argument
            arg = callargs[ callcount++ ];
        } else {
            // expecting this argument but not passed in call
            arg = null;
        }

        diargs.push(arg);
    }

    return diargs;
};

/**
 * checks if an argument name is a dependency injection argument
 * @method is_di_argument
 * @param {string} argname
 * @return {Boolean}
 */
Injector.prototype.is_di_argument = function (argname) {
    return argname in this.deps;
};

/**
 * returns the arguments a function takes
 * @static
 * @method get_function_arguments
 * @param {Function} func
 * @return {Array}
 */
Injector.get_function_arguments = function (func) {
    var rawargs, args = [];

    rawargs = func.toString()
        // clean up white space, easier to find and clean up arg list
        .replace(/\s+/g, '')
        // find first set of parameters, which EVERY function will have
        .match(/\((.+?)\)/);

    if (rawargs && rawargs.length) {
        rawargs = rawargs.pop();
        args = rawargs.split(',');
    }

    return args;
};

module.exports = Injector;
