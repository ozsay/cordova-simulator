;(function(require, window) {
  var ipc = require('ipc');
  var currId = 0;
  var calls = {};

  window.cordova.require('cordova/channel').onCordovaReady.subscribe(function() {
    window.cordova.require('cordova/channel').onCordovaInfoReady.fire();
  });

  window.cordova.require('cordova/channel').onNativeReady.fire();

  ipc.on('cordova-simulator', function(id, keepRequest, successArgs, failArgs) {
    if (failArgs !== undefined) {
      calls[id].fail(failArgs);
    } else {
      calls[id].success(successArgs);
    }

    if (!keepRequest) {
      delete calls[id];
    }
  });

  window.simulatorExec = function(success, fail, service, action, args) {
    var inputOnly = (success === undefined || success === null) && (fail === undefined || fail === null);
    var id;

    if (!inputOnly) {
      id = currId++;
      calls[id] = {success: success, fail: fail};
    }

    ipc.sendToHost('cordova-simulator', id, service, action, args);
  };
})(require, window);
