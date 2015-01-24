#!/usr/bin/env node

var version = require('../package.json').version;

var argv = require('yargs')
    .options('p', {
        alias : 'port',
        default : 80,
        describe: 'The server\'s port'
    })
    .options('l', {
        default : false,
        describe: 'Launch in browser'
    })
    .help('h').alias('h', 'help')
    .version(version, 'v').alias('v', 'version')
    .usage('Starts the cordova simulator.\n' + 
           'Usage: cordova-simulator [-l] [-p num | --port=num] [folder]\n' +
           'Where folder is the folder containing the index.html file of your app\n' +
           'Default folder is www/ from the current directory.')
    .argv;

var run = require('../');

run({
    dir: argv._[0] || 'www/',
    port: argv.port,
    launch: argv.l
});