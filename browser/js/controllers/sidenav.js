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

  dragAppStart(event, app) {
    angular.element(event.target).addClass('dragged');
    event.dataTransfer.setData("appName", app.name);
  }

  dragAppEnd(event) {
    angular.element(event.target).removeClass('dragged');
  }

  dropApp(event, device) {
    var appName = event.dataTransfer.getData('appName');
    angular.element(event.target).removeClass('dropped');

    this.configuration.addRunningDevice(device.name, appName);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  dragOverStart(event) {
    angular.element(event.target).addClass('dropped');
  }

  dragOverEnd(event) {
    angular.element(event.target).removeClass('dropped');
  }

  openSite() {
    shell.openExternal(SITE);
  }
}

SidenavCtrl.$inject = ['Configuration'];
