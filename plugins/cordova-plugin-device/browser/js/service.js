/*jshint esnext: true */

let plugins;

export default class DevicePlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('Device', 'getDeviceInfo', this.getDeviceInfo);
  }

  getDeviceInfo(obj) {
    return {
      platform: obj.device.preset.platform,
      version: obj.device.preset.platformVersion,
      uuid: obj.device.uuid,
      model: obj.device.preset.model
    };
  }
}

DevicePlugin.$inject = ['plugins'];
