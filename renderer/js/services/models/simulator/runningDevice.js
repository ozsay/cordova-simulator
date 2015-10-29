/*jshint esnext: true */

import {isUndefined} from '../../../globals.js';

let controllers = {};

export default class RunningDevice {
  constructor(rawRunningDevice, config) {
    this.name = rawRunningDevice.name;

    this.app = config.apps[rawRunningDevice.app];
    this.device = config.devices[rawRunningDevice.device];
  }

  prepareToSave() {
    this.app = this.app.name;
    this.device = this.device.name;
  }

  setController(ctrl) {
    controllers[this.name] = ctrl;
  }

  removeController() {
    delete controllers[this.name];
  }

  getController() {
    return controllers[this.name];
  }

  validate(config) {
    return !(isUndefined(this.name) ||
            isUndefined(config.apps[this.app]) ||
            isUndefined(config.devices[this.device]));

  }

  static create(rawRunningDevice, config) {
    return new RunningDevice(rawRunningDevice, config);
  }

  static createFromDeviceAndApp(name, app, device) {
    var raw = {name: name, app: app.name, device: device.name};
    var config = {apps: {}, devices: {}};
    config.apps[app.name] = app;
    config.devices[device.name] = device;

    return new RunningDevice(raw, config);
  }

  static factory() {
    return RunningDevice;
  }
}

//RunningDevice.factory.$inject = [];
