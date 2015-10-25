/*jshint esnext: true */

let path = require('path');
let url = require('url');

const CORDOVA_SCRIPT_PATH = path.normalize(__dirname + '/../renderer/js/cordova.js');

export default function(cb) {
  let protocol = require('protocol');

  protocol.registerFileProtocol('simulator-file', (request, callback) => {
    var filePath = url.parse(request.url);
    var fileName = path.basename(filePath.pathname);

    var pathToServe = fileName === 'cordova.js' ? CORDOVA_SCRIPT_PATH : filePath.pathname;

    callback(pathToServe);
  }, (error) => {
    protocol.registerStandardSchemes(['simulator-file']);

    cb(error);
  });

}
