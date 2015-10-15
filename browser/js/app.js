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
import MenuToggle from './directives/menu-toggle';
import RightClick from './directives/right-click';
import ObjectToArrayFilter from './filters/objectToArray';
import Configuration from './services/configuration';
import Alert from './services/alert';

const DRAG_EVENTS = [
  {name: 'dragstart', directive: 'ngDragStart'},
  {name: 'drag', directive: 'ngDrag'},
  {name: 'dragenter', directive: 'ngDragEnter'},
  {name: 'dragleave', directive: 'ngDragLeave'},
  {name: 'dragover', directive: 'ngDragOver'},
  {name: 'drop', directive: 'ngDrop'},
  {name: 'dragend', directive: 'ngDragEnd'}
];

angular.module('cordova-simulator', ['ngMessages', 'ngMaterial', 'cordova-simulator.plugins'])
  .controller('appCtrl', AppCtrl)
  .controller('appDialog', AppDialog)
  .controller('deviceDialog', DeviceDialog)
  .controller('presetDialog', PresetDialog)
  .controller('sidenavCtrl', SidenavCtrl)
  .controller('toolbarCtrl', ToolbarCtrl)
  .directive('device', Device.directiveFactory)
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

angular.forEach(DRAG_EVENTS,
  function(event) {
    var eventName = event.name;
    var directiveName = event.directive;

    angular.module('cordova-simulator').directive(directiveName, ['$parse', '$rootScope', function($parse, $rootScope) {
      return {
        restrict: 'A',
        compile: function($element, attr) {
          var fn = $parse(attr[directiveName], null,  true);
          return function ngEventHandler(scope, element) {
            element.on(eventName, function(event) {
              var callback = function() {
                fn(scope, {$event:event});
              };

              if ($rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          };
        }
      };
    }]);
  }
);
