/*jshint esnext: true */

import BasicDialog from './basicDialog';
import uuid from 'node-uuid';
import {UUID_PATTERN} from '../globals.js';

const DEVICE_TEMPLATE = {
  status: {
    wifi: true,
    isFlashlightOn: false,
    battery: {
      level: 100,
      isCharging: true
    },
    isLandscape: false
  }
};

export default class DeviceDialog extends BasicDialog {
  constructor($rootScope, $mdDialog, device) {
    super($mdDialog, device === undefined, device !== undefined ? DeviceDialog.copyDevice(device) : DeviceDialog.newDevice(device));

    this.$rootScope = $rootScope;

    this.dialogType = 'device';
    this.device = this.model;
    this.presets = this.$rootScope.configuration.presets;
    this.pattern = UUID_PATTERN;
  }

  apply() {
    if (this.device.uuid === undefined || this.device.uuid === '') {
      this.device.uuid = uuid();
    }

    super.apply();
  }

  clone() {
    this.device = super.clone(DeviceDialog.copyDevice(this.device));
  }

  canDelete() {
    var canDelete = true;

    angular.forEach(this.$rootScope.configuration.simulator.runningDevices, (runningDevice) => {
      if (runningDevice.device.name === this.device.name) {
        canDelete = false;
      }
    });

    return canDelete;
  }

  static newDevice() {
    return angular.copy(DEVICE_TEMPLATE);
  }

  static copyDevice(device) {
    var preset = device.preset;
    device = angular.copy(device);
    device.preset = preset;
    return device;
  }
}

DeviceDialog.$inject = ['$rootScope', '$mdDialog', 'model'];
