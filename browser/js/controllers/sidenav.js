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
    this.configuration.openAppConfig(app.name);
  }

  openDeviceConfig(device) {
    this.configuration.openDeviceConfig(device.name);
  }

  openSite() {
    shell.openExternal(SITE);
  }
}

SidenavCtrl.$inject = ['Configuration'];
