/*jshint esnext: true */

let fs = require('remote').require('fs');
let path = require('remote').require('path');
let parser = require('remote').require('xml2js').Parser();
let chokidar = require('remote').require('chokidar');

import {isTrue} from '../../../globals.js';

import PlatformClassFeature from '../utils/platformClass';
import AngularMessageFeature from '../utils/angularMessage';
import App from './app.js';

let $injector;

let safetyShutdown;

let watchers = {};

export default class CordovaApp extends App {
  constructor(rawCordovaApp, config) {
    super(rawCordovaApp, config);

    this.type = 'cordova';
    this.loadConfigXml(() => this.fieldsFromConfigXml());
    this.checkIndexFile();
  }

  apply(app) {
    super.apply(app);

    this.type = 'cordova';

    this.loadConfigXml(() => this.fieldsFromConfigXml());
    this.checkIndexFile();
  }

  startWatching() {
    super.startWatching();

    if (watchers[this.name] === undefined) {
      watchers[this.name] = chokidar.watch(path.join(this.path, 'config.xml'));

      watchers[this.name].on('change', () => {
        this.loadConfigXml(() => {
          this.fieldsFromConfigXml();
          super.reload();
        });
      });
    }
  }

  stopWatching() {
    super.stopWatching();

    if (watchers[this.name] !== undefined) {
      watchers[this.name].close();
      delete watchers[this.name];
    }
  }

  run(runningDeviceCtrl) {
    AngularMessageFeature.start(runningDeviceCtrl);
    PlatformClassFeature.start(runningDeviceCtrl);
  }

  fieldsFromConfigXml() {
    this.properties = {};
    this.properties.orientation = 'all';

    angular.forEach(this.configXml.widget.preference, (preference) => {
      if (preference.$.name === 'Orientation') {
        this.properties.orientation = preference.$.value;
      }
    });
  }

  loadConfigXml(cb) {
    cb = cb || angular.noop;
    fs.readFile(path.join(this.path, 'config.xml'), 'utf8', (readErr, data) => {
      if (!readErr) {
        parser.parseString(data, (parseErr, result) => {
          if (!parseErr) {
            this.configXml = result;
          } else {
            this.parseErr = true;
          }

          cb();
        });
      } else {
        this.readErr = true;
        cb();
      }
    });
  }

  getPath() {
    return path.join(this.path, 'www' || this.serveDir);
  }

  getMain() {
    return 'simulator-file://' + path.join(this.getPath(), 'index.html');
  }

  checkIndexFile(cb) {
    cb = cb || angular.noop;
    fs.access(this.getPath(), fs.F_OK, (err) => {
      if (err) {
        this.locationErr = true;
      }

      cb();
    });
  }

  prepareToSave() {
    super.prepareToSave();

    delete this.properties;
    delete this.configXml;
    delete this.parseErr;
    delete this.readErr;
    delete this.locationErr;
  }

  validate(config) {
    return (super.validate(config) && (isTrue(this.parseErr) ||
                                       isTrue(this.readErr) ||
                                       isTrue(this.locationErr)));
  }

  static create(rawCordovaApp, config) {
      return new CordovaApp(rawCordovaApp, config);
  }

  static factory(_$injector, _safetyShutdown) {
    $injector = _$injector;

    safetyShutdown = _safetyShutdown;

    $injector.instantiate(AngularMessageFeature.factory);

    safetyShutdown.register(() => {
      angular.forEach(watchers, (watcher) => watcher.close());
    });

    return CordovaApp;
  }
}

CordovaApp.factory.$inject = ['$injector', 'SafetyShutdown'];
