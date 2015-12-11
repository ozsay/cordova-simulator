/*jshint esnext: true */


let FILE_PATH;
const DEFAULT_FILE_PATH = 'defaultConfig.json';
const GIST_URL = 'https://api.github.com/gists/6b6ae17c1997cf20703f';
const GIST_FILE_NAME = 'cordova-simulator-config';

let $http;
let $rootScope;
let $mdDialog;
let alert;

let path;
let fs;
let os;
let shell;
let clipboard;

let cordovaApp;
let preset;
let simulator;
let device;

export default class Configuration {
  constructor(_$http, _$rootScope, _$mdDialog, _path, _fs, _os, _shell, _clipboard, _alert, _cordovaApp, _preset, _simulator, _device) {
    $http = _$http;
    $rootScope = _$rootScope;
    $mdDialog = _$mdDialog;

    path = _path;
    fs = _fs;
    shell = _shell;
    os = _os;
    clipboard = _clipboard;

    alert = _alert;
    cordovaApp = _cordovaApp;
    preset = _preset;
    simulator = _simulator;
    device = _device;

    FILE_PATH = path.join(os.homedir(), '.cordovaSimulatorConfig.json');
    console.log(FILE_PATH);
  }

  _createConfig(rawConfig) {
    var config = {apps: {}, presets: {}, devices: {}};

    angular.forEach(rawConfig.apps, (_app, appName) => {
      config.apps[appName] = cordovaApp.create(_app, config);
    });

    angular.forEach(rawConfig.presets, (_preset, presetName) => {
      config.presets[presetName] = preset.create(_preset, config);
    });

    angular.forEach(rawConfig.devices, (_device, deviceName) => {
      config.devices[deviceName] = device.create(_device, config);
    });

    config.simulator = simulator.create(rawConfig.simulator, config);

    return config;
  }

  _prepareToSave(config) {
    config = angular.copy(config);

    config.simulator.prepareToSave();

    angular.forEach(config.apps, (_app) => {
      _app.prepareToSave();
    });

    angular.forEach(config.devices, (_device) => {
      _device.prepareToSave();
    });

    angular.forEach(config.presets, (_preset) => {
      _preset.prepareToSave();
    });

    return config;
  }

  _listenToSaveEvents() {
    $rootScope.$on('request-to-save', () => this.save());
  }

  defaultConfig(cb) {
    fs.readFile(DEFAULT_FILE_PATH, 'utf8', (err, config) => {
      if (!err) {
        config = angular.fromJson(config);
        $rootScope.configuration = this._createConfig(config);
        cb();
      }
    });
  }

  load(cb) {
    cb = cb || angular.noop;

    fs.access(FILE_PATH, fs.F_OK, (err) => {
      if (err) {
        $rootScope.firstUse = true;
        this.defaultConfig(cb);
      } else {
        fs.readFile(FILE_PATH, 'utf8', (err, config) => {
          config = angular.fromJson(config);
          if (err) {
            alert.error('Can\'t read configuration file. Loading default configuration');
            this.defaultConfig(cb);
          } else {
            $rootScope.configuration = this._createConfig(config);
            this._listenToSaveEvents();
            cb();
          }
        });
      }
    });
  }

  save(cb) {
    cb = cb || angular.noop;
    fs.writeFile(FILE_PATH, angular.toJson(this._prepareToSave($rootScope.configuration), true), (err) => cb(err));
  }

  loadFromGithub() {
    $http.get(GIST_URL)
    .success((data) => {
        try {
            var gist = angular.fromJson(data.files[GIST_FILE_NAME].content);

            angular.forEach(gist.presets, (_preset, presetName) => {
              if (configuration.presets[presetName] === undefined) {
                  $rootScope.configuration.presets[presetName] = preset.create(_preset, $rootScope.configuration);
              }
            });

            alert.info('Data was loaded');
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

      $rootScope.configuration = this._createConfig(configInClipboard);
      alert.info('Configuration was imported');
    } catch (e) {
      alert.warning('Can\'t import - parsing has failed.');
    }
  }

  exportToClipboard() {
    var config = this._prepareToSave($rootScope.configuration);

    clipboard.writeText(angular.toJson(config, true));
    alert.info('Configuration was exported');
  }

  showConfigFile() {
    shell.showItemInFolder(FILE_PATH);
  }

  _createFileFromLocation(deviceName, appLocation) {
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

  openAppConfig(_app) {
    this._openDialog(_app, 'partials/app-config.html', 'appDialog', (app) => {
      if (_app === undefined) {
        $rootScope.configuration.apps[app.name] = cordovaApp.create(app, $rootScope.configuration);
      } else {
        _app.apply(app);
      }
    }, (app) => delete $rootScope.configuration.apps[app.name]);
  }

  openPresetConfig(__preset) {
    this._openDialog(__preset, 'partials/preset-config.html', 'presetDialog', (_preset) => {
      if (__preset === undefined || __preset.name !== _preset.name) {
        $rootScope.configuration.presets[_preset.name] = preset.create(_preset, $rootScope.configuration);
      } else {
        __preset.apply(_preset);
      }
    }, (_preset) => delete $rootScope.configuration.presets[_preset.name]);
  }

  openDeviceConfig(__device) {
    this._openDialog(__device, 'partials/device-config.html', 'deviceDialog', (_device) => {
      if (__device === undefined || __device.name !== _device.name) {
        $rootScope.configuration.devices[_device.name] = device.create(_device, $rootScope.configuration);
      } else {
        __device.apply(_device);
      }
    }, (_device) => delete $rootScope.configuration.devices[_device.name]);
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

Configuration.$inject = ['$http', '$rootScope', '$mdDialog', 'path', 'fs', 'os', 'shell', 'clipboard', 'Alert', 'CordovaApp', 'Preset', 'Simulator', 'Device'];
