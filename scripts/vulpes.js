#!/usr/bin/env node

'use strict';

var program = require('commander'),
    color = require('cli-color'),
    env = require('node-env-file'),
    fs = require('fs');

var pkg = require('./../package.json'),
    cwd = process.cwd();

if (fs.existsSync(cwd + '/.env')) {
    env(cwd + '/.env');
}

program.command('start')
    .description('starts the node server')
    .action(function () {
        console.log(color.xterm(232)('                        '));
        console.log(color.xterm(254)('     /\\                '));
        console.log(color.xterm(222)('    (~(                 '));
        console.log(color.xterm(222)('     ) )     /\\_/\\    '));
        console.log(color.xterm(222)('    ( _-----_(- -)      '));
        console.log(color.xterm(222)('      (       \\ /      '));
        console.log(color.xterm(222)('      /|/--\\|\\ V      '));
        console.log(color.xterm(244)('      " "   " "         '));
        console.log(color.xterm(232)('                        '));

        process.env.NODE_PATH = cwd + '/node_modules/';
        require('./server');
    });

program.command('create <app>')
    .description('create a new vulpes application')
    .action(function (app) {
        var packagejson;

        [
            app,
            app + '/app',
            app + '/assets',
            app + '/config',
            app + '/lib',
        ].forEach(function (dir) {
            console.log('  creating %s', color.xterm(222)(dir));
            fs.mkdirSync(dir);
        });

        packagejson = fs.openSync(app + '/package.json', 'w');
        fs.writeSync(packagejson, JSON.stringify({
            name: app,
            version: '0.0.0',
            dependencies: {
                vulpes: 'https://github.com/minond/vulpes/tarball/master'
            }
        }, null, '  '));
        fs.closeSync(packagejson);
    });

program.version(pkg.version)
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}
