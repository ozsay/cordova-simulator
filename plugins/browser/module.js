/*jshint esnext: true */

import angular from 'angular';

import Plugins from './plugins';

import DevicePlugin from '../cordova-plugin-device/browser/js/service';

angular.module('cordova-simulator.plugins', [])
  .service('plugins', Plugins)
  .service('devicePlugin', DevicePlugin)
  .run(['$injector', ($injector) => {
    $injector.instantiate(DevicePlugin);
  }]);
