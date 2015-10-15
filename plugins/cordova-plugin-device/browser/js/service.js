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
      uuid: '1A2FDEF0-C09D-4DB4-A8BE-7EC2F4A6E49A',
      model: obj.device.preset.model
    };
  }
}

DevicePlugin.$inject = ['plugins'];
