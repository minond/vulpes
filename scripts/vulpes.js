#!/usr/bin/env node

'use strict';

var program = require('commander'),
    color = require('cli-color'),
    env = require('node-env-file'),
    pkg = require('./../package.json'),
    fs = require('fs'),
    cwd = process.cwd();

if (fs.existsSync(cwd + '/.env')) {
    env(cwd + '/.env');
}

program.command('start')
    .alias('s')
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

program.version(pkg.version)
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}
