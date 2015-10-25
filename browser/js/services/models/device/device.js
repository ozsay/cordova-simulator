/*jshint esnext: true */

import {UUID_PATTERN, isUndefined} from '../../../globals.js';

import {_DeviceStatus} from './status';

let $timeout;

class _Device {
  constructor(rawDevice, config) {
    this.name = rawDevice.name;
    this.uuid = rawDevice.uuid;

    this.preset = config.presets[rawDevice.preset];
    this.status = new _DeviceStatus(rawDevice, config);
  }

  vibrate(sender, duration, cb) {
    cb = cb || angular.noop;
    if (sender.vibration !== undefined) {
        $timeout.cancel(sender.vibration);
    }

    sender.elem.addClass("shake shake-constant");

    sender.vibration = $timeout(function() {
        sender.elem.removeClass("shake shake-constant");
        cb();
    }, duration);
  }

  cancelVibration(sender) {
      if (sender.vibration !== undefined) {
          $timeout.cancel(sender.vibration);
          sender.elem.removeClass("shake shake-constant");
      }
  }

  apply(device) {
    this.uuid = device.uuid;

    this.preset = device.preset;
    this.status.apply(device);
  }

  prepareToSave() {
    this.preset = this.preset.name;
  }

  validate(config) {
    return (!(isUndefined(this.name) ||
            isUndefined(config.presets[this.preset]) ||
            isUndefined(this.uuid) ||
            !UUID_PATTERN.test(this.uuid)) &&
            this.status.validate());
  }
}

export default class Device {
  constructor(_$timeout) {
    $timeout = _$timeout;
  }

  create(rawDevice, config) {
    return new _Device(rawDevice, config);
  }
}

Device.$inject = ['$timeout'];
