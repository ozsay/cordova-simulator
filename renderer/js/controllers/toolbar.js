/*jshint esnext: true */

export default class ToolbarCtrl {
  constructor($rootScope, $mdDialog, app, currentWindow, config) {
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.config = config;
    this.app = app;
    this.currentWindow = currentWindow;
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
    this.currentWindow.safeReload();
  }

  openDevTools() {
    this.currentWindow.openDevTools();
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
    this.app.safeQuit();
  }
}

ToolbarCtrl.$inject = ['$rootScope', '$mdDialog', 'app', 'currentWindow', 'Configuration'];
