/*jshint esnext: true */

let fs = require('remote').require('fs');
let path = require('remote').require('path');
let parser = require('remote').require('xml2js').Parser();

import {isTrue} from '../../../globals.js';

import {_App} from './app.js';

class _CordovaApp extends _App {
  constructor(rawCordovaApp, config) {
    super(rawCordovaApp, config);

    this.type = 'cordova';
    this.loadConfigXml();
    this.checkIndexFile();
  }

  apply(app) {
    super.apply(app);

    this.type = 'cordova';

    this.loadConfigXml();
    this.checkIndexFile();
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

  checkIndexFile(cb) {
    cb = cb || angular.noop;
    fs.access(path.join(this.path, 'www' || this.serveDir, 'index.html'), fs.F_OK, (err) => {
      if (err) {
        this.locationErr = true;
      }

      cb();
    });
  }

  prepareToSave() {
    super.prepareToSave();

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
}

export default class CordovaApp {
  create(rawCordovaApp, config) {
      return new _CordovaApp(rawCordovaApp, config);
  }
}

//CordovaApp.$inject = [];
