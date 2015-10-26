/*jshint esnext: true */

import angular from 'angular';

import Plugins from './plugins';

import ActionSheetPlugin from '../cordova-plugin-actionsheet/renderer/js/service';
import AppVersionPlugin from '../cordova-plugin-app-version/renderer/js/service';
import BetteryStatusPlugin from '../cordova-plugin-battery-status/renderer/js/service';
import ClipboardPlugin from '../com.verso.cordova.clipboard/renderer/js/service';
import DevicePlugin from '../cordova-plugin-device/renderer/js/service';
import DialogsPlugin from '../cordova-plugin-dialogs/renderer/js/service';
import FlashlightPlugin from '../nl.x-services.plugins.flashlight/renderer/js/service';
import NetworkInformationPlugin from '../cordova-plugin-network-information/renderer/js/service';
import VibrationPlugin from '../cordova-plugin-vibration/renderer/js/service';

angular.module('cordova-simulator.plugins', [])
  .service('plugins', Plugins)
  .run(['$injector', ($injector) => {
    $injector.instantiate(ActionSheetPlugin);
    $injector.instantiate(AppVersionPlugin);
    $injector.instantiate(BetteryStatusPlugin);
    $injector.instantiate(ClipboardPlugin);
    $injector.instantiate(DevicePlugin);
    $injector.instantiate(DialogsPlugin);
    $injector.instantiate(FlashlightPlugin);
    $injector.instantiate(NetworkInformationPlugin);
    $injector.instantiate(VibrationPlugin);
  }]);
