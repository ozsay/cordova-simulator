/*jshint esnext: true */

const indicator = '';

export default class ToolbarCtrl {
  constructor(config) {
    this.config = config;
    this.indicator = indicator;
  }

  openAppConfig(name) {
    if (name !== undefined) {
      this.config.openAppConfig(name);
    }
  }

  openDeviceConfig(name) {
    if (name !== undefined) {
      this.config.openDeviceConfig(name);
    }
  }

  openPresetConfig(name) {
    if (name !== undefined) {
      this.config.openPresetConfig(name);
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
