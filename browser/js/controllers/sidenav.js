/*jshint esnext: true */

const SITE = 'https://github.com/ozsay/cordova-simulator';

var shell = require('shell');

export default class SidenavCtrl {
  constructor(configuration) {
    this.configuration = configuration;
  }

  openMenu($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  }

  openAppConfig(app) {
    this.configuration.openAppConfig(app);
  }

  openDeviceConfig(device) {
    this.configuration.openDeviceConfig(device);
  }

  dropApp(deviceName, appName, files) {
    if (files.length > 0) {
      
    } else {
      this.configuration.addRunningDevice(deviceName, appName);
    }
  }

  openSite() {
    shell.openExternal(SITE);
  }
}

SidenavCtrl.$inject = ['Configuration'];
