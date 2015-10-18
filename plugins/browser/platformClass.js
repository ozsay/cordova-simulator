/*jshint esnext: true */

let fs = require('remote').require('fs');

let plugins;

let injectionScript;

export default class PlatformClassFeature {
  constructor(_plugins) {
    plugins = _plugins;

    fs.readFile('./plugins/browser/platformClassInject.js', 'utf8', (err, data) => {
      if (err) {
        console.log(err.path);
      } else {
        injectionScript = data;

        plugins.registerCustomFeature('platformClass', this);
      }
    });
  }

  exec(runningDevice) {
    runningDevice.webViewElement.addEventListener('dom-ready', () => {
      runningDevice.webViewElement.executeJavaScript(injectionScript.replace('$$$', runningDevice.device.preset.platform));
    });
  }
}

PlatformClassFeature.$inject = ['plugins'];
