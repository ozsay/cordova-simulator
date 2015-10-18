/*jshint esnext: true */

import angular from 'angular';

import Plugins from './plugins';

import AngularMessageFeature from './angularMessage';
import PlatformClassFeature from './platformClass';
import ReloadFeature from './reload';

import DevicePlugin from '../cordova-plugin-device/browser/js/service';

angular.module('cordova-simulator.plugins', [])
  .service('plugins', Plugins)
  .service('devicePlugin', DevicePlugin)
  .service('angularMessage', AngularMessageFeature)
  .service('platformClass', PlatformClassFeature)
  .service('reload', ReloadFeature)
  .run(['$injector', ($injector) => {
    $injector.instantiate(PlatformClassFeature);
    $injector.instantiate(AngularMessageFeature);
    $injector.instantiate(ReloadFeature);
    $injector.instantiate(DevicePlugin);
  }]);
