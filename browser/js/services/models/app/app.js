/*jshint esnext: true */

import {isUndefined} from '../../../globals.js';

let $rootScope;

export class _App {
  constructor(rawApp, config) {
    this.name = rawApp.name;

    this.apply(rawApp);
  }

  apply(app) {
    this.path = app.path;
    this.enabled = app.enabled || false;
    this.immutable = app.immutable || false;
  }

  prepareToSave() {
  }

  changeAppState(state) {
    this.enabled = state || !this.enabled;

    if (!this.enabled) {
      angular.forEach($rootScope.configuration.simulator.runningDevices, (runningDevice, key) => {
        if (runningDevice.app === this) {
          delete $rootScope.configuration.simulator.runningDevices[key];
        }
      });
    }

    $rootScope.$emit('request-to-save');
  }

  validate(config) {
    return !(isUndefined(this.name) ||
             isUndefined(this.path));
  }
}

export class App {
  constructor(_$rootScope) {
    $rootScope = _$rootScope;
  }
}

App.$inject = ['$rootScope'];
