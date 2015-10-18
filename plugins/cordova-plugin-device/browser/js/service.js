/*jshint esnext: true */

let plugins;

export default class DevicePlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('Device', 'getDeviceInfo', this.getDeviceInfo);
  }

  getDeviceInfo(sender) {
    return {
      platform: sender.device.preset.platform,
      version: sender.device.preset.platformVersion,
      uuid: sender.device.uuid,
      model: sender.device.preset.model
    };
  }
}

DevicePlugin.$inject = ['plugins'];
