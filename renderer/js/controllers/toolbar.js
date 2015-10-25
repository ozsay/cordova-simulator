/*jshint esnext: true */

import {SITE, REPOSITORY, ISSUES, NEW_ISSUE} from '../globals.js';

let app = require('remote').require('app');
let browserWindow = require('remote').getCurrentWindow();

export default class ToolbarCtrl {
  constructor($rootScope, $mdDialog, config) {
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.config = config;
  }

  openAppConfig(app) {
    this.config.openAppConfig(app);
  }

  openDeviceConfig(device) {
    if (device !== null) {
      this.config.openDeviceConfig(device);
    }
  }

  openPresetConfig(preset) {
    if (preset !== null) {
      this.config.openPresetConfig(preset);
    }
  }

  loadFromGithub() {
    this.config.loadFromGithub();
  }

  importFromClipboard() {
    this.config.importFromClipboard();
  }

  exportToClipboard() {
    this.config.exportToClipboard();
  }

  showConfigFile() {
    this.config.showConfigFile();
  }

  reload() {
    browserWindow.reload();
  }

  openDevTools() {
    browserWindow.openDevTools();
  }

  openCordovaDetails() {
    this.$mdDialog.show({
      clickOutsideToClose: true,
      templateUrl: 'partials/cordova-details.html',
      controllerAs: 'dialog',
      scope: this.$rootScope,
      preserveScope: true,
      controller: ['$mdDialog', function ($mdDialog) {
        this.discard = () => {
          $mdDialog.hide();
        };
      }]
    });
  }

  openAbout() {

  }

  openReleaseNotes() {

  }

  quit() {
    app.quit();
  }
}

ToolbarCtrl.$inject = ['$rootScope', '$mdDialog', 'Configuration'];