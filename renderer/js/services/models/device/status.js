/*jshint esnext: true */

import {NETWORKS, isUndefined, isBoolean, isNumber} from '../../../globals.js';

let $rootScope;

export default class DeviceStatus {
  constructor(rawDevice, config) {
    this.apply(rawDevice);
  }

  apply(device) {
    this.network = device.status.network;
    this.isFlashlightOn = device.status.isFlashlightOn;
    this.wifi = device.status.wifi;
    this.battery = {
      level: device.status.battery.level,
      isCharging: device.status.battery.isCharging
    };
  }

  changeWifi(wifi) {
    this.wifi = wifi || !this.wifi;

    $rootScope.$emit('request-to-save');
  }

  changeBatteryCharging(isCharging) {
    this.battery.isCharging = isCharging || !this.battery.isCharging;

    $rootScope.$emit('request-to-save');
  }

  turnFlashLight(status) {
    this.isFlashlightOn = status || !this.isFlashlightOn;

    $rootScope.$emit('request-to-save');
  }

  prepareToSave() {
    delete this.clipboard;
  }

  validate(config) {
    return !(NETWORKS.indexOf(this.network) === -1 ||
            !isBoolean(this.wifi) ||
            !isBoolean(this.isFlashlightOn) ||
            isUndefined(this.battery) ||
            !isBoolean(this.battery.isCharging) ||
            !isNumber(this.battery.level) ||
            (this.battery.level < 0 || this.battery.level > 100));
  }

  static factory(_$rootScope) {
    $rootScope = _$rootScope;
  }
}

DeviceStatus.factory.$inject = ['$rootScope'];
