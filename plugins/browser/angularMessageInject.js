;(function(require, window) {
  var ipc = require('ipc');

  if (window.angular !== undefined) {
    ipc.sendToHost('angular-exists');
  }
})(require, window);
