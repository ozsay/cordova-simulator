/*jshint esnext: true */

let remoteProcess = require('remote').process;

export const SIMULATOR_VERSION = remoteProcess.versions.simulator;
export const CORDOVA_VERSION = remoteProcess.versions.cordova;
export const CORDOVA_PLUGINS = angular.copy(remoteProcess.cordovaPlugins);

export const SITE = 'https://github.com/ozsay/cordova-simulator';
//export const SITE = 'http://ozsay.github.io/cordova-simulator/';
export const REPOSITORY = 'https://github.com/ozsay/cordova-simulator';
export const ISSUES = 'https://github.com/ozsay/cordova-simulator/issues';
export const NEW_ISSUE = 'https://github.com/ozsay/cordova-simulator/issues/new';

export const SUPPORTED_PLATFORMS = {
  ios: {
    display: 'iOS',
    cordovaName: 'ios'
  },
  android: {
    display: 'Android',
    cordovaName: 'android'
  },
  wp8: {
    display: 'Windows Phone 8',
    cordovaName: 'wp8'
  }
};
export const FEATURES = [
  'Front Camera', 'Rear Camera', 'WIFI', '3g', '4g', '2g', 'ethernet'
];
export const NETWORKS = ['unknown', 'ethernet', '2g', '3g', '4g', 'cellular', 'none'];
export const UUID_PATTERN = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

export var isUndefined = angular.isUndefined;
export var isNumber = angular.isNumber;
export function isBoolean(val) {
  return typeof val === 'boolean';
}
export function isTrue(val) {
  return val === true;
}
export function isFalse(val) {
  return val === false || isUndefined(val);
}
