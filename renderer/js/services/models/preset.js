/*jshint esnext: true */

import {SUPPORTED_PLATFORMS, FEATURES, isUndefined} from '../../globals.js';

export default class Preset {
  constructor(rawPreset, config) {
    this.apply(rawPreset);
  }

  apply(preset) {
    Object.assign(this, preset);
  }

  prepareToSave() {
  }

  validate(config) {
    var isValid = true;

    if (isUndefined(this.name) ||
        isUndefined(this.width) ||
        isUndefined(this.height) ||
        isUndefined(SUPPORTED_PLATFORMS[this.platform])) {

        isValid = false;
    }

    angular.forEach(this.availableFeatues, (feature) => {
      if (FEATURES.indexOf(feature) === -1) {
        isValid = false;
      }
    });

    return isValid;
  }

  static create(rawPreset, config) {
    return new Preset(rawPreset, config);
  }

  static factory() {
    return Preset;
  }
}

//Preset.factory.$inject = [];
