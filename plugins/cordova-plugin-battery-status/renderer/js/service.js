/*jshint esnext: true */

let plugins;

export default class BatteryStatusPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('Battery', 'start', this.start, true);
    plugins.registerCommand('Battery', 'stop', this.stop);
  }

  start(sender, request) {
    function getStatus() {
      return {level: sender.device.status.battery.level, isPlugged: sender.device.status.battery.isCharging};
    }

    sender.watch(() => sender.device.status.battery.isCharging, () => {
      sender.sendToDevice(request, true, getStatus());
    });

    sender.watch(() => sender.device.status.battery.level, () => {
      sender.sendToDevice(request, true, getStatus());
    });

    return {
      keepRequest: true,
      data: getStatus()
    };
  }

  stop(sender) {

  }
}

BatteryStatusPlugin.$inject = ['plugins'];
