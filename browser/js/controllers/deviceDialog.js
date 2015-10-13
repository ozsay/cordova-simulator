/*jshint esnext: true */

import BasicDialog from './basicDialog';

export default class DeviceDialog extends BasicDialog {
  constructor($rootScope, $mdDialog, device) {
    super($mdDialog, device === undefined, device !== undefined ? DeviceDialog.copyDevice(device) : {});

    this.$rootScope = $rootScope;

    this.dialogType = 'device';
    this.device = this.model;
    this.presets = this.$rootScope.configuration.presets;
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

  static copyDevice(device) {
    var preset = device.preset;
    device = angular.copy(device);
    device.preset = preset;
    return device;
  }
}

DeviceDialog.$inject = ['$rootScope', '$mdDialog', 'model'];
