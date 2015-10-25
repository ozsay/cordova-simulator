/*jshint esnext: true */

import {NETWORKS} from '../globals.js';

let path = require('remote').require('path');

let $rootScope;
let $timeout;

let $mdDialog;

let plugins;

class DeviceCtrl {
  constructor(elem, $scope) {
    this.elem = elem;
    this.$scope = $scope;

    this.webViewElement = angular.element(elem.children().children()[2]).children()[0];
    this.webView = angular.element(this.webViewElement);

    this.backdrop = angular.element(angular.element(elem.children().children()[2]).children()[1]);
    this.widget = angular.element(angular.element(elem.children().children()[2]).children()[2]);

    this.device = this.runningDevice.device;
    this.app = this.runningDevice.app;

    this.logs = '';

    this.startListening();
    this.reloadApp();
    this.resizeDevice();
    this.execCustomFeatures();
    this.NETWORKS = NETWORKS;

    $scope.$on('$destroy', () => plugins.destroy(this));
  }

  sandbox(fn) {
    $timeout(() => fn());
  }

  watch(fn, cb) {
    this.$scope.$watch(fn, cb);
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
        plugins.execCommand(this, event.args[0], event.args[1], event.args[2], event.args[3])
        .then((result) => {
          if (event.args[0] !== null) {
            if (result !== undefined && result.keepRequest) {
              this.webViewElement.send('cordova-simulator', event.args[0], true, result.data);
            } else {
              this.webViewElement.send('cordova-simulator', event.args[0], false, result);
            }
          }
        })
        .catch((err) => {
          if (event.args[0] !== null) {
            this.webViewElement.send('cordova-simulator', event.args[0], false, undefined, err);
          }
        });
      }
    });
  }

  sendToDevice(id, keepRequest, successArgs) {
    this.webViewElement.send('cordova-simulator', id, keepRequest, successArgs);
  }

  startWorking() {
    this.isWorking = true;
  }

  stopWorking() {
    this.isWorking = false;
  }

  reloadApp() {
    this.hideWidget();
    this.startWorking();

    this.orientation = 'all';

    angular.forEach(this.app.configXml.widget.preference, (preference) => {
      if (preference.$.name === 'Orientation') {
        this.orientation = preference.$.value;
      }
    });

    if (this.orientation === 'landscape') {
      this.isLandscape = true;
    } else if (this.orientation === 'portrait') {
      this.isLandscape = false;
    }

    if (this.app.path !== undefined) {
      this.webViewElement.src = 'simulator-file://' + path.join(this.app.path, 'www', 'index.html');
    }
  }

  resizeDevice() {
    var height = this.device.preset.height;
    var width = this.device.preset.width;

    if (this.isLandscape) {
      this.elem.children().css({width: height + 'px', height: (width + 100) + 'px'});
      this.webView.css({width: height + 'px', height: width + 'px'});
    } else {
      this.elem.children().css({width: width + 'px', height: (height + 100) + 'px'});
      this.webView.css({width: width + 'px', height: height + 'px'});
    }
  }

  rotateDevice() {
    this.isLandscape = !this.isLandscape;

    this.resizeDevice();
  }

  showLogs() {
    var logs = this.logs;

    $mdDialog.show({
      clickOutsideToClose: true,
      templateUrl: 'partials/device-logs.html',
      controllerAs: 'dialog',
      controller: function () {
        this.logs = logs;
        this.discard = () => {
          $mdDialog.hide();
        };
      }
    });
  }

  openDevTools() {
    this.webViewElement.openDevTools();
  }

  closeApp() {
    $rootScope.configuration.simulator.removeRunningDevice(this.app, this.device);
  }

  showWidget(element, css, backdrop, backdropClick) {
    this.widgetData = {element: element, backdrop: backdrop, backdropClick: backdropClick};

    this.widget.append(element);
    this.widget.css(css);
    this.widget.addClass('on');

    if (backdrop) {
      this.backdrop.addClass('on');
    }
  }

  hideWidget() {
    if (this.widgetData) {
      if (this.widgetData.backdrop) {
        this.backdrop.removeClass('on');
      }

      delete this.widgetData;
      this.widget.empty();
      this.widget.removeAttr('style');
      this.widget.removeClass('on');
    }
  }

  backdropClick() {
    if (this.widgetData.backdropClick) {
      this.widgetData.backdropClick();
    }
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

  static directiveFactory(_$rootScope, _$timeout, _$mdDialog, _plugins) {
    $rootScope = _$rootScope;
    $timeout = _$timeout;

    $mdDialog = _$mdDialog;

    plugins = _plugins;

    Device.instance = new Device();

    return Device.instance;
  }
}

Device.directiveFactory.$inject = ['$rootScope', '$timeout', '$mdDialog', 'plugins'];
