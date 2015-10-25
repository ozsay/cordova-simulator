/*jshint esnext: true */

let reloadMain = require('remote').require('./../plugins/main/reload');
let plugins;

export default class ReloadFeature {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCustomFeature('reload', this);
  }

  exec(sender) {
    reloadMain.startListening(sender.runningDevice.name, sender.app.path, () => sender.sandbox(() => sender.reloadApp()));
  }

  destroy(sender) {
    reloadMain.stopListening(sender.runningDevice.name);
  }
}

ReloadFeature.$inject = ['plugins'];
