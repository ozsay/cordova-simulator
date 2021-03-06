/*jshint esnext: true */

import angular from 'angular';
import 'angular-material';
import 'angular-messages';
import 'cordova-plugins';
import 'angular-electron';

import * as globals from './globals';

import AppCtrl from './controllers/app';
import AppDialog from './controllers/appDialog';
import DeviceDialog from './controllers/deviceDialog';
import PresetDialog from './controllers/presetDialog';
import SidenavCtrl from './controllers/sidenav';
import ToolbarCtrl from './controllers/toolbar';
import AppExists from './directives/app-exists';
import DeviceExists from './directives/device-exists';
import Device from './directives/device';
import Drag from './directives/drag';
import Drop from './directives/drop';
import MenuToggle from './directives/menu-toggle';
import PresetExists from './directives/preset-exists';
import RightClick from './directives/right-click';
import ObjectToArrayFilter from './filters/objectToArray';
import Configuration from './services/configuration';
import Alert from './services/alert';
import Simulator from './services/models/simulator/simulator';
import RunningDevice from './services/models/simulator/runningDevice';
import App from './services/models/app/app';
import CordovaApp from './services/models/app/cordovaApp';
import Preset from './services/models/preset';
import DeviceModel from './services/models/device/device';

angular.module('cordova-simulator', ['ngMessages', 'ngMaterial', 'angular-electron', 'cordova-simulator.plugins'])
  .controller('appCtrl', AppCtrl)
  .controller('appDialog', AppDialog)
  .controller('deviceDialog', DeviceDialog)
  .controller('presetDialog', PresetDialog)
  .controller('sidenavCtrl', SidenavCtrl)
  .controller('toolbarCtrl', ToolbarCtrl)
  .directive('appExists', AppExists.directiveFactory)
  .directive('deviceExists', DeviceExists.directiveFactory)
  .directive('device', Device.directiveFactory)
  .directive('drag', Drag.directiveFactory)
  .directive('drop', Drop.directiveFactory)
  .directive('menuToggle', MenuToggle.directiveFactory)
  .directive('presetExists', PresetExists.directiveFactory)
  .directive('rightClick', RightClick.directiveFactory)
  .filter('objectToArray', ObjectToArrayFilter.Factory)
  .service('Configuration', Configuration)
  .service('Alert', Alert)
  .service('Simulator', Simulator.factory)
  .service('RunningDevice', RunningDevice.factory)
  .service('CordovaApp', CordovaApp.factory)
  .service('Preset', Preset.factory)
  .service('Device', DeviceModel.factory)
  .config(['remoteProvider', (remoteProvider) => {
    remoteProvider.register('chokidar');
    remoteProvider.register('xml2js');
  }])
  .config(['$sceProvider', ($sceProvider) => {
    $sceProvider.enabled(false);
  }])
  .run(['$rootScope', '$injector', ($rootScope, $injector) => {
    $rootScope.globals = globals;

    $injector.instantiate(App.factory);
  }])
  .run(['Configuration', (configuration) => {
    configuration.load();
  }]);
