/*jshint esnext: true */

import angular from 'angular';

import Plugins from './plugins';

import AngularMessageFeature from './angularMessage';
import PlatformClassFeature from './platformClass';
import ReloadFeature from './reload';

import ClipboardPlugin from '../com.verso.cordova.clipboard/browser/js/service';
import DevicePlugin from '../cordova-plugin-device/browser/js/service';
import FlashlightPlugin from '../nl.x-services.plugins.flashlight/browser/js/service';

angular.module('cordova-simulator.plugins', [])
  .service('plugins', Plugins)
  .service('angularMessage', AngularMessageFeature)
  .service('platformClass', PlatformClassFeature)
  .service('reload', ReloadFeature)

  .service('clipboardPlugin', ClipboardPlugin)
  .service('devicePlugin', DevicePlugin)
  .service('flashlightPlugin', FlashlightPlugin)
  .run(['$injector', ($injector) => {
    $injector.instantiate(PlatformClassFeature);
    $injector.instantiate(AngularMessageFeature);
    $injector.instantiate(ReloadFeature);

    $injector.instantiate(ClipboardPlugin);
    $injector.instantiate(DevicePlugin);
    $injector.instantiate(FlashlightPlugin);
  }]);
