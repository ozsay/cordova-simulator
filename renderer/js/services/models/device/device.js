/*jshint esnext: true */

import {UUID_PATTERN, isUndefined} from '../../../globals.js';

import DeviceStatus from './status';

import ActionSheet from './actionsheet';
import Dialogs from './dialogs';
import Vibration from './vibration';

let $injector;

export default class Device {
  constructor(rawDevice, config) {
    this.name = rawDevice.name;
    this.uuid = rawDevice.uuid;

    this.preset = config.presets[rawDevice.preset];
    this.status = new DeviceStatus(rawDevice, config);

    this.setActions();
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

  setActions() {
    this.alert = Dialogs.alert;
    this.confirm = Dialogs.confirm;
    this.prompt = Dialogs.prompt;
    this.beep = Dialogs.beep;

    this.showActionSheet = ActionSheet.show;
    this.hideActionSheet = ActionSheet.hide;

    this.vibrate = Vibration.vibrate;
    this.cancelVibration = Vibration.cancelVibration;
  }

  static create(rawDevice, config) {
    return new Device(rawDevice, config);
  }

  static factory(_$injector) {
    $injector = _$injector;

    $injector.instantiate(DeviceStatus.factory);

    $injector.instantiate(ActionSheet.factory);
    $injector.instantiate(Dialogs.factory);
    $injector.instantiate(Vibration.factory);

    return Device;
  }
}

Device.factory.$inject = ['$injector'];
