/*jshint esnext: true */

const FILE_PATH = require('remote').require('path').join(require('remote').require('os').homedir(), '.cordovaSimulatorConfig.json');
const DEFAULT_FILE_PATH = '';
const GIST_URL = 'https://api.github.com/gists/6b6ae17c1997cf20703f';
const GIST_FILE_NAME = 'cordova-simulator-config';
const SUPPORTED_PLATFORMS = ['iOS', 'Android', 'Windows Phone 8'];
const FEATURES = [
  'Front Camera', 'Rear Camera', 'WIFI', '3G', '4G', '2G'
];

let jsonfile = require('remote').require('jsonfile');
let shell = require('shell');
let clipboard = require('clipboard');

export default class Configuration {
  constructor($http, $q, $rootScope, $mdDialog, alert) {
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.alert = alert;
  }

  _validate(config) {
    var isValid = true;

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

    return config;
  }

  _stringsToData(config) {
    angular.forEach(config.devices, function(device) {
      device.preset = config.presets[device.preset];
    });

    return config;
  }

  _copyComponent(model, type) {
    switch (type) {
      case 'app':
        return angular.copy(model);
      case 'preset':
        return angular.copy(model);
      case 'device': {
        var preset = model.preset;
        model = angular.copy(model);
        model.preset = preset;
        return model;
      }
    }
  }

  load(cb) {
    jsonfile.readFile(FILE_PATH, (err, config) => {
      config = angular.copy(config);
      if (err) {
        this.alert.error('Can\'t read configuration file. Loading default configuration');
      } else if (!this._validate(config)) {
          this.alert.error('Configuration file is not valid. Loading default configuration');
      } else {
        this.configuration  = this.$rootScope.configuration = this._stringsToData(config);
      }
      cb();
    });
  }

  save(cb) {
    jsonfile.writeFile(FILE_PATH, this._dataToStrings(angular.copy(this.configuration)), {spaces: 2}, (err) => cb(err));
  }

  loadFromGithub() {
    this.$http.get(GIST_URL)
    .success((data) => {
        try {
            var gist = angular.fromJson(data.files[GIST_FILE_NAME].content);

            if (!this._validate(gist)) {
              this.alert.warning('Can\'t load from Github - validation has failed.');
            } else  {
              angular.forEach(gist.presets, (preset, name) => {
                  if (this.configuration.presets[name] === undefined) {
                      this.configuration.presets[name] = preset;
                  }
              });

              this.alert.info('Data was loaded');
            }
        } catch (e) {
            this.alert.warning('Can\'t load from Github - parsing has failed.');
        }
    })
    .error(() => {
        this.alert.warning('Can\'t load from Github - HTTP get has failed.');
    });
  }

  importFromClipboard() {
    try {
      var configInClipboard = angular.fromJson(clipboard.readText());

      if (!this._validate(configInClipboard)) {
        this.alert.warning('Can\'t import - validation has failed.');
      } else {
        this.configuration = this.$rootScope.configuration = this._stringsToData(configInClipboard);
        this.alert.info('Configuration was imported');
      }
    } catch (e) {
      this.alert.warning('Can\'t import - parsing has failed.');
    }
  }

  exportToClipboard() {
    var config = this._dataToStrings(angular.copy(this.configuration));

    clipboard.writeText(angular.toJson(config, true));
    this.alert.info('Configuration was exported');
  }

  showConfigFile() {
    shell.showItemInFolder(FILE_PATH);
  }

  openAppConfig(name) {
    var model = this.configuration.apps[name];

    var isNew = false;

    if (model === undefined) {
      model = {};
      isNew = true;
    } else {
      model = this._copyComponent(model, 'app');
    }

    this._openDialog(model,
                     'app',
                     isNew,
                     this.configuration.apps,
                     'partials/app-config.html');
  }

  openDeviceConfig(name) {
    var model = this.configuration.devices[name];
    var isNew = false;

    if (model === undefined) {
      model = {};
      isNew = true;
    } else {
      model = this._copyComponent(model, 'device');
    }

    this._openDialog(model,
                     'device',
                     isNew,
                     this.configuration.devices,
                     'partials/device-config.html',
                      {presets: this.configuration.presets});
  }

  openPresetConfig(name) {
    var model = this.configuration.presets[name];
    var isNew = false;

    if (model === undefined) {
      model = {
        availableFeatues: []
      };
      isNew = true;
    } else {
      model = this._copyComponent(model, 'preset');
    }

    this._openDialog(model,
                     'preset',
                     isNew,
                     this.configuration.presets,
                     'partials/preset-config.html',
                     {  supportedPlatforms: SUPPORTED_PLATFORMS,
                        features: FEATURES,
                        predicateFn: (value) => model.availableFeatues.indexOf(value) == -1});
  }

  _openDialog(model, type, isNew, collection, templateUrl, options) {
    var that = this;

    this.$mdDialog.show({
      templateUrl: templateUrl,
      controller: function() {
        this.model = model;
        this.isNew = isNew;
        this.options = options;

        this.apply = () => that.$mdDialog.hide({model: this.model, message: this.model.name + ' ' + type + ' was ' + (this.isNew ? 'added' : 'changed')});
        this.discard = () => that.$mdDialog.cancel({message: 'No changes has been made'});
        this.delete = () => {
          // TODO: Validation
          delete collection[model.name];
          that.save((err) => {
            if (err) {
              that.alert.error('Error while saving configuration to filesystem');
            }
          });
          that.$mdDialog.cancel({message: this.model.name + ' ' + type + ' was deleted'});
        };
        this.clone = () => {
          this.model = that._copyComponent(model, type);
          this.model.name = undefined;
          this.isNew = true;
        };
      },
      controllerAs: 'dialog'
    }).then((object) => {
      collection[object.model.name] = object.model;
      this.save((err) => {
        if (err) {
          this.alert.error('Error while saving configuration to filesystem');
        } else {
          this.alert.info(object.message);
        }
      });
    }, (object) => {
      this.alert.warning(object.message);
    });
  }
}

Configuration.$inject = ['$http', '$q', '$rootScope', '$mdDialog', 'Alert'];
