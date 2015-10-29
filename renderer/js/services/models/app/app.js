/*jshint esnext: true */

import {isUndefined} from '../../../globals.js';

let chokidar = require('remote').require('chokidar');

let $rootScope;

let safetyShutdown;

let watchers = {};

export default class App {
  constructor(rawApp, config) {
    this.name = rawApp.name;

    this.apply(rawApp);
  }

  apply(app) {
    this.path = app.path;
    this.enabled = app.enabled || false;
    this.immutable = app.immutable || false;

    if (this.enabled) {
      this.appEnabled();
    } else {
      this.appDisabled();
    }
  }

  prepareToSave() {
  }

  getPath() {
    return this.path;
  }

  startWatching() {
    if (watchers[this.name] === undefined) {
      watchers[this.name] = chokidar.watch(this.getPath());

      watchers[this.name].on('ready', () => {
        watchers[this.name].on('all', (event, path) => this.reload());
      });
    }
  }

  stopWatching() {
    if (watchers[this.name] !== undefined) {
      watchers[this.name].close();
      delete watchers[this.name];
    }
  }

  reload() {
    angular.forEach($rootScope.configuration.simulator.runningDevices, (runningDevice, key) => {
      if (runningDevice.app === this) {
        var ctrl = runningDevice.getController();
        if (ctrl !== undefined) {
          ctrl.sandbox(() => ctrl.reloadApp());
        }
      }
    });
  }

  appEnabled() {
    this.startWatching();
  }

  appDisabled() {
    this.stopWatching();
  }

  changeAppState(state) {
    this.enabled = state || !this.enabled;

    if (this.enabled) {
      this.appEnabled();
    }
    else {
      angular.forEach($rootScope.configuration.simulator.runningDevices, (runningDevice, key) => {
        if (runningDevice.app === this) {
          delete $rootScope.configuration.simulator.runningDevices[key];
        }
      });

      this.appDisabled();
    }

    $rootScope.$emit('request-to-save');
  }

  validate(config) {
    return !(isUndefined(this.name) ||
             isUndefined(this.path));
  }

  static factory(_$rootScope, _safetyShutdown) {
    $rootScope = _$rootScope;

    safetyShutdown = _safetyShutdown;

    safetyShutdown.register(() => {
      angular.forEach(watchers, (watcher) => watcher.close());
    });
  }
}

App.factory.$inject = ['$rootScope', 'SafetyShutdown'];
