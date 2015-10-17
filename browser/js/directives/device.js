/*jshint esnext: true */

let configuration;
let plugins;

class DeviceCtrl {
  constructor(elem) {
    this.elem = elem;
    this.webViewElement = angular.element(elem.children().children()[2]).children()[0];
    this.webView = angular.element(this.webViewElement);

    this.resizeDevice();
    this.startListening();
    this.reloadApp();
  }

  startListening() {
    this.webViewElement.addEventListener('ipc-message', (event) => {
      plugins.execCommand(this, event.args[1], event.args[2], event.args[3])
      .then((result) => {
        if (event.args[0] !== undefined) {
          this.webViewElement.send('cordova-simulator', event.args[0], result);
        }
      })
      .catch((err) => {
        if (event.args[0] !== undefined) {
          this.webViewElement.send('cordova-simulator', event.args[0], undefined, err);
        }
      });
    });
  }

  reloadApp() {
    if (this.app.path !== undefined) {
      this.webViewElement.src = 'simulator-file://' + this.app.path;
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
  }

  changeBatteryCharging() {
    this.device.status.battery.isCharging = !this.device.status.battery.isCharging;
  }
}

DeviceCtrl.$inject = ['$element'];

export default class Device {
  constructor() {
    this.templateUrl = 'partials/device.html';
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      device: "=",
      app: "="
    };
    this.controller = DeviceCtrl;
    this.controllerAs = "runningDevice";
    this.require = "device";
  }

  static directiveFactory(_configuration, _plugins) {
    configuration = _configuration;
    plugins = _plugins;

    Device.instance = new Device();

    return Device.instance;
  }
}

Device.directiveFactory.$inject = ['Configuration', 'plugins'];
