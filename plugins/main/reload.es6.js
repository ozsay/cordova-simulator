/*jshint esnext: true */

let chokidar = require('chokidar');

let watchers = {};

let startListening = (runningDevice, appPath, cb) => {
  var watcher = chokidar.watch(appPath).on('all', (event, path) => {
    cb();
  });

  if (watchers[runningDevice] !== undefined) {
      exports.stopListening(runningDevice);
  }

  watchers[runningDevice] = watcher;
};

let stopListening = (runningDevice) => {
  watchers[runningDevice].close();
  delete watchers[runningDevice];
};

export {startListening, stopListening};
