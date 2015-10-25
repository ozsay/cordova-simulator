/*jshint esnext: true */

let fs = require('remote').require('fs');

let plugins;

let injectionScript;

export default class AngularMessageFeature {
  constructor(_plugins) {
    plugins = _plugins;

    fs.readFile('./plugins/renderer/angularMessageInject.js', 'utf8', (err, data) => {
      if (err) {
        console.log(err.path);
      } else {
        injectionScript = data;

        plugins.registerCustomFeature('angularMessage', this);
      }
    });
  }

  exec(runningDevice) {
    runningDevice.webViewElement.addEventListener('ipc-message', (event) => {
      if (event.channel === 'angular-exists') {
        console.log('ok');
      }
    });

    runningDevice.webViewElement.addEventListener('dom-ready', () => {
      runningDevice.webViewElement.executeJavaScript(injectionScript);
    });
  }
}

AngularMessageFeature.$inject = ['plugins'];
