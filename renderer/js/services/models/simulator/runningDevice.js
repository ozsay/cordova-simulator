/*jshint esnext: true */

import {isUndefined} from '../../../globals.js';

class _RunningDevice {
  constructor(rawRunningDevice, config) {
    this.name = rawRunningDevice.name;

    this.app = config.apps[rawRunningDevice.app];
    this.device = config.devices[rawRunningDevice.device];
  }

  prepareToSave() {
    this.app = this.app.name;
    this.device = this.device.name;
  }

  validate(config) {
    return !(isUndefined(this.name) ||
            isUndefined(config.apps[this.app]) ||
            isUndefined(config.devices[this.device]));

  }
}

export default class RunningDevice {
  create(rawRunningDevice, config) {
    return new _RunningDevice(rawRunningDevice, config);
  }

  createFromDeviceAndApp(name, app, device) {
    var raw = {name: name, app: app.name, device: device.name};
    var config = {apps: {}, devices: {}};
    config.apps[app.name] = app;
    config.devices[device.name] = device;

    return new _RunningDevice(raw, config);
  }
}

//RunningDevice.$inject = [];
