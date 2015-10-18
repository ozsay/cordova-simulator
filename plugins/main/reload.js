var chokidar = require('chokidar');

var watchers = {};

exports.startListening = function (runningDevice, appPath, cb) {
  var watcher = chokidar.watch(appPath).on('all', function(event, path) {
    cb();
  });

  if (watchers[runningDevice] !== undefined) {
      exports.stopListening(runningDevice);
  }

  watchers[runningDevice] = watcher;
};

exports.stopListening = function (runningDevice) {
  watchers[runningDevice].close();
  delete watchers[runningDevice];
};
