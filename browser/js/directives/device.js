/*jshint esnext: true */

let path = require('remote').require('path');

let $timeout;

let configuration;
let plugins;

class DeviceCtrl {
  constructor(elem, $scope) {
    this.elem = elem;

    this.webViewElement = angular.element(elem.children().children()[2]).children()[0];
    this.webView = angular.element(this.webViewElement);

    this.device = this.runningDevice.device;
    this.app = this.runningDevice.app;

    this.resizeDevice();
    this.startListening();
    this.reloadApp();
    this.execCustomFeatures();

    $scope.$on('$destroy', () => plugins.destroy(this));
  }

  sandbox(fn) {
    $timeout(() => fn());
  }

  execCustomFeatures() {
    plugins.execCustomFeatures(this);
  }

  startListening() {
    this.webViewElement.addEventListener('dom-ready', () => {
      this.stopWorking();
    });

    this.webViewElement.addEventListener('ipc-message', (event) => {
      if (event.channel === 'cordova-simulator') {
        plugins.execCommand(this, event.args[1], event.args[2], event.args[3])
        .then((result) => {
          if (event.args[0] !== null) {
            this.webViewElement.send('cordova-simulator', event.args[0], result);
          }
        })
        .catch((err) => {
          if (event.args[0] !== null) {
            this.webViewElement.send('cordova-simulator', event.args[0], undefined, err);
          }
        });
      }
    });
  }

  startWorking() {
    this.isWorking = true;
  }

  stopWorking() {
    this.isWorking = false;
  }

  reloadApp() {
    this.startWorking();
    if (this.app.path !== undefined) {
      this.webViewElement.src = 'simulator-file://' + path.join(this.app.path, 'www', 'index.html');
    }
  }

  resizeDevice() {
    if (this.device.status.isLandscape) {
      this.elem.children().css({width: this.device.preset.height + 'px', height: (this.device.preset.width + 100) + 'px'});
      this.webView.css({width: this.device.preset.height + 'px', height: this.device.preset.width + 'px'});
    } else {
      this.elem.children().css({width: this.device.preset.width + 'px', height: (this.device.preset.height + 100) + 'px'});
      this.webView.css({width: this.device.preset.width + 'px', height: this.device.preset.height + 'px'});
    }
  }

  rotateDevice() {
    this.device.status.isLandscape = !this.device.status.isLandscape;
    configuration.save();

    this.resizeDevice();
  }

  openDevTools() {
    this.webViewElement.openDevTools();
  }

  closeApp() {
    configuration.removeRunningDevice(this.device.name, this.app.name);
  }

  changeWifi() {
    this.device.status.wifi = !this.device.status.wifi;
    configuration.save();
  }

  changeBatteryCharging() {
    this.device.status.battery.isCharging = !this.device.status.battery.isCharging;
    configuration.save();
  }

  turnFlashLight(status) {
    this.device.status.isFlashlightOn = status === undefined ? !this.device.status.isFlashlightOn : status;
    configuration.save();
  }
}

DeviceCtrl.$inject = ['$element', '$scope'];

export default class Device {
  constructor() {
    this.templateUrl = 'partials/device.html';
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      runningDevice: "="
    };
    this.controller = DeviceCtrl;
    this.controllerAs = "runningDevice";
    this.require = "device";
  }

  static directiveFactory(_$timeout, _configuration, _plugins) {
    $timeout = _$timeout;

    configuration = _configuration;
    plugins = _plugins;

    Device.instance = new Device();

    return Device.instance;
  }
}

Device.directiveFactory.$inject = ['$timeout', 'Configuration', 'plugins'];
