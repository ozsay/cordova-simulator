/*jshint esnext: true */

let plugins;

export default class FlashlightPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('Flashlight', 'available', this.available);
    plugins.registerCommand('Flashlight', 'switchOn', this.switchOn);
    plugins.registerCommand('Flashlight', 'switchOff', this.switchOff);
  }

  available(sender) {
      return true;
  }
  switchOn(sender) {
    sender.sandbox(() => sender.turnFlashLight(true));
  }
  switchOff(sender) {
      sender.sandbox(() => sender.turnFlashLight(false));
  }
}

FlashlightPlugin.$inject = ['plugins'];
