/*jshint esnext: true */

import {SUPPORTED_PLATFORMS, FEATURES} from '../globals.js';

const FILE_PATH = require('remote').require('path').join(require('remote').require('os').homedir(), '.cordovaSimulatorConfig.json');
const DEFAULT_FILE_PATH = '';
const GIST_URL = 'https://api.github.com/gists/6b6ae17c1997cf20703f';
const GIST_FILE_NAME = 'cordova-simulator-config';

let jsonfile = require('remote').require('jsonfile');
let shell = require('shell');
let clipboard = require('clipboard');

let $http;
let $rootScope;
let $mdDialog;
let alert;

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

    if (config.simulator === undefined || config.simulator.runningDevices === undefined) {
      isValid = false;
    } else {
      angular.forEach(config.simulator.runningDevices, function(runningDevice) {
        if (config.apps[runningDevice.app] === undefined || config.devices[runningDevice.device] === undefined) {
          isValid = false;
        }
      });
    }

    angular.forEach(config.apps, (app) => {
      if ((app.name === undefined) ||
          (app.isMeteor && app.url === undefined) ||
          (!app.isMeteor && app.path === undefined)) {
          isValid = false;
      }
    });

    angular.forEach(config.devices, (device) => {
      if ((device.name === undefined) ||
          (config.presets[device.preset] === undefined)) {
          isValid = false;
      }
    });

    angular.forEach(config.presets, (preset) => {
      if ((preset.name === undefined) ||
          (preset.width === undefined) ||
          (preset.height === undefined) ||
          (SUPPORTED_PLATFORMS.indexOf(preset.platform) === -1)) {
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
    jsonfile.readFile(FILE_PATH, (err, config) => {
      config = angular.copy(config);
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
    jsonfile.writeFile(FILE_PATH, this._dataToStrings(angular.copy(configuration)), {spaces: 2}, (err) => cb(err));
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
    configuration.simulator.runningDevices[deviceName + '_' + appName] = {device: configuration.devices[deviceName], app: configuration.apps[appName]};
    this.save(() => {});
  }

  removeRunningDevice(deviceName, appName) {
    delete configuration.simulator.runningDevices[deviceName + '_' + appName];
    this.save(() => {});
  }

  openAppConfig(_app) {
    this._openDialog(_app, 'partials/app-config.html', 'appDialog', (app) => configuration.apps[app.name] = app, (app) => delete configuration.apps[app.name]);
  }

  openPresetConfig(_preset) {
    this._openDialog(_preset, 'partials/preset-config.html', 'presetDialog', (preset) => configuration.presets[preset.name] = preset, (preset) => delete configuration.presets[preset.name]);
  }

  openDeviceConfig(_device) {
    this._openDialog(_device, 'partials/device-config.html', 'deviceDialog', (device) => configuration.devices[device.name] = device, (device) => delete configuration.devices[device.name]);
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