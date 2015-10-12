/*jshint esnext: true */

import angular from 'angular';
import 'angular-material';
import 'angular-messages';
import AppCtrl from './controllers/app';
import SidenavCtrl from './controllers/sidenav';
import ToolbarCtrl from './controllers/toolbar';
import MenuToggle from './directives/menu-toggle';
import RightClick from './directives/right-click';
import ObjectToArrayFilter from './filters/objectToArray';
import Configuration from './services/configuration';
import Alert from './services/alert';

angular.module('cordova-simulator', ['ngMessages', 'ngMaterial'])
    .controller('appCtrl', AppCtrl)
    .controller('sidenavCtrl', SidenavCtrl)
    .controller('toolbarCtrl', ToolbarCtrl)
    .directive('menuToggle', MenuToggle.directiveFactory)
    .directive('rightClick', RightClick.directiveFactory)
    .filter('objectToArray', ObjectToArrayFilter.Factory)
    .service('Configuration', Configuration)
    .service('Alert', Alert)
    .run(['Configuration', (configuration) => {
      configuration.load(() => {});
    }]);
