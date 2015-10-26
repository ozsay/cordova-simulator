/*jshint esnext: true */

let app = require('remote').require('app');
let browserWindow = require('remote').getCurrentWindow();

export default class ToolbarCtrl {
  constructor($rootScope, $mdDialog, config, safetyShutdown) {
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.config = config;
    this.safetyShutdown = safetyShutdown;
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
    this.safetyShutdown.exec().finally(() => {
      browserWindow.reload();
    });
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

ToolbarCtrl.$inject = ['$rootScope', '$mdDialog', 'Configuration', 'SafetyShutdown'];
