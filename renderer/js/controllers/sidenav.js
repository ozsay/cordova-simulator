/*jshint esnext: true */

export default class SidenavCtrl {
  constructor($rootScope, configuration) {
    this.$rootScope = $rootScope;

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

  changeAppState(app) {
    app.changeAppState();
  }

  dropApp(device, appName, files) {
    if (files.length > 0) {
      this.configuration.createFileFromLocation(deviceName, files[0].path);
    } else {
      var app = this.$rootScope.configuration.apps[appName];

      this.$rootScope.configuration.simulator.addRunningDevice(app, device);
    }
  }
}

SidenavCtrl.$inject = ['$rootScope', 'Configuration'];
