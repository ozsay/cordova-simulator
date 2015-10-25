/*jshint esnext: true */

let pjson = require('../package.json');

process.versions.simulator = pjson.version;
process.versions.cordova = pjson.devDependencies['cordova-js'];
process.cordovaPlugins = pjson.cordovaPlugins;
