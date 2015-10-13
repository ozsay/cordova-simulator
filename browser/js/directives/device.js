/*jshint esnext: true */

let configuration;

export default class Device {
  constructor() {
    this.templateUrl = 'partials/device.html';
    this.restrict = 'E';
    this.scope = {
      device: "=",
      app: "="
    };
  }

  link(scope, elem, attrs) {
    var webView = angular.element(angular.element(elem.children().children()[2]).children()[0]);

    elem.children().css({width: scope.device.preset.width + 'px', height: (scope.device.preset.height + 100) + 'px'});
    webView.css({width: scope.device.preset.width + 'px', height: scope.device.preset.height + 'px'});

    scope.status = {
      wifi: true,
      isFlashlightOn: false,
      battery: {
        level: 100,
        isCharging: false
      },
      isLandscape: false
    };

    scope.reloadApp = () => {
      webView[0].src = scope.app.path;
    };

    scope.openDevTools = () => {
      webView[0].openDevTools();
    };

    scope.closeApp = () => {
      configuration.removeRunningDevice(scope.device.name, scope.app.name);
    };

    scope.rotateDevice = () => {
      scope.status.isLandscape = !scope.status.isLandscape;

      if (scope.status.isLandscape) {
        elem.children().css({width: scope.device.preset.height + 'px', height: (scope.device.preset.width + 100) + 'px'});
        webView.css({width: scope.device.preset.height + 'px', height: scope.device.preset.width + 'px'});
      } else {
        elem.children().css({width: scope.device.preset.width + 'px', height: (scope.device.preset.height + 100) + 'px'});
        webView.css({width: scope.device.preset.width + 'px', height: scope.device.preset.height + 'px'});
      }
    };

    scope.changeWifi = () => {
      scope.status.wifi = !scope.status.wifi;
    };
  }

  static directiveFactory(_configuration) {
    configuration = _configuration;
    Device.instance = new Device();

    return Device.instance;
  }
}

Device.directiveFactory.$inject = ['Configuration'];
