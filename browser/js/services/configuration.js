/*jshint esnext: true */

import {SUPPORTED_PLATFORMS, FEATURES, UUID_PATTERN} from '../globals.js';

let path = require('remote').require('path');
let fs = require('remote').require('fs');
let shell = require('shell');
let clipboard = require('clipboard');

const FILE_PATH = path.join(require('remote').require('os').homedir(), '.cordovaSimulatorConfig.json');
const DEFAULT_FILE_PATH = '';
const GIST_URL = 'https://api.github.com/gists/6b6ae17c1997cf20703f';
const GIST_FILE_NAME = 'cordova-simulator-config';

let $http;
let $rootScope;
let $mdDialog;
let alert;

let isUndefined = angular.isUndefined;
let isNumber = angular.isNumber;
let isBoolean  = function(val) {
  return typeof val === 'boolean';
};
let isTrue  = function(val) {
  return val === true;
};
let isFalse  = function(val) {
  return val === false || isUndefined(val);
};

let configuration;

export default class Configuration {
  constructor(_$http, _$rootScope, _$mdDialog, _alert) {
    $http = _$http;
    $rootScope = _$rootScope;
    $mdDialog = _$mdDialog;
    alert = _alert;
  }

  _validate(config) {
    var isValid = true;

    if (isUndefined(config.simulator) || isUndefined(config.simulator.runningDevices)) {
      isValid = false;
    } else {
      angular.forEach(config.simulator.runningDevices, function(runningDevice) {
        if (isUndefined(runningDevice.name) ||
            isUndefined(config.apps[runningDevice.app]) ||
            isUndefined(config.devices[runningDevice.device])) {
          isValid = false;
        }
      });
    }

    angular.forEach(config.apps, (app) => {
      if (isUndefined(app.name) ||
          isTrue(app.isMeteor) && isUndefined(app.url) ||
          isFalse(app.isMeteor) && isUndefined(app.path)) {
          isValid = false;
      }
    });

    angular.forEach(config.devices, (device) => {
      if (isUndefined(device.name) ||
          isUndefined(config.presets[device.preset]) ||
          isUndefined(device.uuid) ||
          !UUID_PATTERN.test(device.uuid) ||
          isUndefined(device.status) ||
          !isBoolean(device.status.wifi) ||
          !isBoolean(device.status.isFlashlightOn) ||
          !isBoolean(device.status.isLandscape) ||
          isUndefined(device.status.battery) ||
          !isBoolean(device.status.battery.isCharging) ||
          !isNumber(device.status.battery.level) ||
          (device.status.battery.level < 0 || device.status.battery.level > 100)) {
          isValid = false;
      }
    });

    angular.forEach(config.presets, (preset) => {
      if (isUndefined(preset.name) ||
          isUndefined(preset.width) ||
          isUndefined(preset.height) ||
          isUndefined(SUPPORTED_PLATFORMS[preset.platform])) {
          isValid = false;
      }

      angular.forEach(preset.availableFeatues, (feature) => {
        if (FEATURES.indexOf(feature) === -1) {
          isValid = false;
        }
      });
    });

    return isValid;
  }

  _dataToStrings(config) {
    angular.forEach(config.devices, function(device) {
      device.preset = device.preset.name;
    });

    angular.forEach(config.simulator.runningDevices, function(runningDevice) {
      runningDevice.app = runningDevice.app.name;
      runningDevice.device = runningDevice.device.name;
    });

    return config;
  }

  _stringsToData(config) {
    angular.forEach(config.devices, function(device) {
      device.preset = config.presets[device.preset];
    });

    angular.forEach(config.simulator.runningDevices, function(runningDevice) {
      runningDevice.app = config.apps[runningDevice.app];
      runningDevice.device = config.devices[runningDevice.device];
    });

    return config;
  }

  load(cb) {
    fs.readFile(FILE_PATH, 'utf8', (err, config) => {
      config = angular.fromJson(config);
      if (err) {
        alert.error('Can\'t read configuration file. Loading default configuration');
      } else if (!this._validate(config)) {
          alert.error('Configuration file is not valid. Loading default configuration');
      } else {
        configuration  = $rootScope.configuration = this._stringsToData(config);
      }
      cb();
    });
  }

  save(cb) {
    cb = cb || angular.noop;
    fs.writeFile(FILE_PATH, angular.toJson(this._dataToStrings(angular.copy(configuration)), true), (err) => cb(err));
  }

  loadFromGithub() {
    $http.get(GIST_URL)
    .success((data) => {
        try {
            var gist = angular.fromJson(data.files[GIST_FILE_NAME].content);

            if (!this._validate(gist)) {
              alert.warning('Can\'t load from Github - validation has failed.');
            } else  {
              angular.forEach(gist.presets, (preset, name) => {
                  if (configuration.presets[name] === undefined) {
                      configuration.presets[name] = preset;
                  }
              });

              alert.info('Data was loaded');
            }
        } catch (e) {
            alert.warning('Can\'t load from Github - parsing has failed.');
        }
    })
    .error(() => {
        alert.warning('Can\'t load from Github - HTTP get has failed.');
    });
  }

  importFromClipboard() {
    try {
      var configInClipboard = angular.fromJson(clipboard.readText());

      if (!this._validate(configInClipboard)) {
        alert.warning('Can\'t import - validation has failed.');
      } else {
        configuration = $rootScope.configuration = this._stringsToData(configInClipboard);
        alert.info('Configuration was imported');
      }
    } catch (e) {
      alert.warning('Can\'t import - parsing has failed.');
    }
  }

  exportToClipboard() {
    var config = this._dataToStrings(angular.copy(configuration));

    clipboard.writeText(angular.toJson(config, true));
    alert.info('Configuration was exported');
  }

  showConfigFile() {
    shell.showItemInFolder(FILE_PATH);
  }

  addRunningDevice(deviceName, appName) {
    if (configuration.apps[appName].enabled) {
      var name = deviceName + '_' + appName;
      if (isUndefined(configuration.simulator.runningDevices[name])) {
        configuration.simulator.runningDevices[name] = {name: name, device: configuration.devices[deviceName], app: configuration.apps[appName]};
        this.save(() => {});
      } else {
        alert.warning(appName + ' is already running on ' + deviceName);
      }
    } else {
      alert.warning(appName + ' is not enabled');
    }
  }

  removeRunningDevice(deviceName, appName) {
    delete configuration.simulator.runningDevices[deviceName + '_' + appName];
    this.save(() => {});
  }

  applyFields(source, target) {
    angular.forEach(source, (val, key) => {
      target[key] = val;
    });
  }

  createFileFromLocation(deviceName, appLocation) {
    var locArr = appLocation.split(path.sep);

    if (locArr.length > 3) {
      var appName = locArr[locArr.length - 3];

      configuration.apps[appName] = {
        name: appName,
        path: appLocation,
        enabled: true
      };

      this.addRunningDevice(deviceName, appName);
    }
  }

  isAppExists(appName) {
    return !isUndefined(configuration.apps[appName]);
  }

  isPresetExists(presetName) {
    return !isUndefined(configuration.presets[presetName]);
  }

  isDeviceExists(deviceName) {
    return !isUndefined(configuration.devices[deviceName]);
  }

  changeAppState(app) {
    app.enabled = !app.enabled;

    if (!app.enabled) {
      angular.forEach(configuration.simulator.runningDevices, (runningDevice, key) => {
        if (runningDevice.app === app) {
          delete configuration.simulator.runningDevices[key];
        }
      });
    }

    this.save(() => {});
  }

  openAppConfig(_app) {
    this._openDialog(_app, 'partials/app-config.html', 'appDialog', (app) => {
      if (_app === undefined) {
        configuration.apps[app.name] = app;
      } else {
        this.applyFields(app, _app);
      }
    }, (app) => delete configuration.apps[app.name]);
  }

  openPresetConfig(_preset) {
    this._openDialog(_preset, 'partials/preset-config.html', 'presetDialog', (preset) => {
      if (_preset === undefined || _preset.name !== preset.name) {
        configuration.presets[preset.name] = preset;
      } else {
        this.applyFields(preset, _preset);
      }
    }, (preset) => delete configuration.presets[preset.name]);
  }

  openDeviceConfig(_device) {
    this._openDialog(_device, 'partials/device-config.html', 'deviceDialog', (device) => {
      if (_device === undefined || _device.name !== device.name) {
        configuration.devices[device.name] = device;
      } else {
        this.applyFields(device,  _device);
      }
    }, (device) => delete configuration.devices[device.name]);
  }

  _openDialog(model, templateUrl, controller, applyFn, deleteFn) {
    $mdDialog.show({
      templateUrl: templateUrl,
      controller: controller,
      escapeToClose: false,
      controllerAs: 'dialog',
      locals: {
        model: model
      }
    }).then((object) => {
      if (object.toDelete) {
        deleteFn(object.model);
      } else {
        applyFn(object.model);
      }
      this.save((err) => {
        if (err) {
          alert.error('Error while saving configuration to filesystem');
        } else {
          alert.info(object.message);
        }
      });
    }, (object) => {
      alert.warning(object.message);
    });
  }
}

Configuration.$inject = ['$http', '$rootScope', '$mdDialog', 'Alert'];
