/*jshint esnext: true */

import {isUndefined} from '../../../globals.js';

let $rootScope;

let runningDevice;

class _Simulator {
  constructor(rawSimulator, config) {
    this.AppsMenuToggle = rawSimulator.AppsMenuToggle;
    this.DevicesMenuToggle = rawSimulator.DevicesMenuToggle;
    this.ResourcesMenuToggle = rawSimulator.ResourcesMenuToggle;
    this.runningDevices = {};

    angular.forEach(rawSimulator.runningDevices, (_runningDevice, name) => {
      this.runningDevices[name] = runningDevice.create(_runningDevice, config);
    });
  }

  addRunningDevice(app, device) {
    var name = device.name + '_' + app.name;

    if (this.runningDevices[name] !== undefined) {
      throw new Error(device.name + ' is already running ' + app.name);
    } else if (!app.enabled) {
      throw new Error(app.name + ' is disabled');
    } else {
      this.runningDevices[name] = runningDevice.createFromDeviceAndApp(name, app, device);
      $rootScope.$emit('request-to-save');
    }
  }

  removeRunningDevice(app, device) {
    delete this.runningDevices[device.name + '_' + app.name];

    $rootScope.$emit('request-to-save');
  }

  prepareToSave() {
    angular.forEach(this.runningDevices, (_runningDevice, name) => {
      _runningDevice.prepareToSave();
    });
  }

  validate(config) {
    var isValid = true;

    angular.forEach(this.runningDevices, (_runningDevice) => {
      if (!_runningDevice.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }
}

export default class Simulator {
  constructor(_$rootScope, _runningDevice) {
    $rootScope = _$rootScope;

    runningDevice = _runningDevice;
  }

  create(rawSimulator, config) {
    return new _Simulator(rawSimulator, config);
  }
}

Simulator.$inject = ['$rootScope', 'RunningDevice'];
