/*jshint esnext: true */

import {SUPPORTED_PLATFORMS, FEATURES} from '../globals.js';
import BasicDialog from './basicDialog';

export default class PresetDialog extends BasicDialog {
  constructor($rootScope, $mdDialog, preset) {
    super($mdDialog, preset === undefined, preset !== undefined ? angular.copy(preset) : {availableFeatues: []});

    this.$rootScope = $rootScope;

    this.dialogType = 'preset';
    this.preset = this.model;

    this.SUPPORTED_PLATFORMS = SUPPORTED_PLATFORMS;
    this.FEATURES = FEATURES;

    this.featureFilter = this._featureFilter.bind(this);
  }

  clone() {
    this.preset = super.clone(angular.copy(this.preset));
  }

  canDelete() {
    var canDelete = true;

    angular.forEach(this.$rootScope.configuration.devices, (device) => {
      if (device.preset.name === this.preset.name) {
        canDelete = false;
      }
    });

    return canDelete;
  }

  _featureFilter(value) {
    return this.preset.availableFeatues.indexOf(value) == -1;
  }
}

PresetDialog.$inject = ['$rootScope', '$mdDialog', 'model'];
