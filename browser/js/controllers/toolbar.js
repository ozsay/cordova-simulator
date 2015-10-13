/*jshint esnext: true */

export default class ToolbarCtrl {
  constructor(config) {
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
}

ToolbarCtrl.$inject = ['Configuration'];
