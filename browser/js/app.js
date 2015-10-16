/*jshint esnext: true */

import angular from 'angular';
import 'angular-material';
import 'angular-messages';
import 'cordova-plugins';

import AppCtrl from './controllers/app';
import AppDialog from './controllers/appDialog';
import DeviceDialog from './controllers/deviceDialog';
import PresetDialog from './controllers/presetDialog';
import SidenavCtrl from './controllers/sidenav';
import ToolbarCtrl from './controllers/toolbar';
import Device from './directives/device';
import Drag from './directives/drag';
import Drop from './directives/drop';
import MenuToggle from './directives/menu-toggle';
import RightClick from './directives/right-click';
import ObjectToArrayFilter from './filters/objectToArray';
import Configuration from './services/configuration';
import Alert from './services/alert';

angular.module('cordova-simulator', ['ngMessages', 'ngMaterial', 'cordova-simulator.plugins'])
  .controller('appCtrl', AppCtrl)
  .controller('appDialog', AppDialog)
  .controller('deviceDialog', DeviceDialog)
  .controller('presetDialog', PresetDialog)
  .controller('sidenavCtrl', SidenavCtrl)
  .controller('toolbarCtrl', ToolbarCtrl)
  .directive('device', Device.directiveFactory)
  .directive('drag', Drag.directiveFactory)
  .directive('drop', Drop.directiveFactory)
  .directive('menuToggle', MenuToggle.directiveFactory)
  .directive('rightClick', RightClick.directiveFactory)
  .filter('objectToArray', ObjectToArrayFilter.Factory)
  .service('Configuration', Configuration)
  .service('Alert', Alert)
  .config(['$sceProvider', ($sceProvider) => {
    $sceProvider.enabled(false);
  }])
  .run(['Configuration', (configuration) => {
    configuration.load(() => {});
  }]);
