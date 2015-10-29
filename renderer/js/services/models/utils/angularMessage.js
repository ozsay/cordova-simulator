/*jshint esnext: true */

import angularMessageInject from './angularMessageInject.js!text';

import template from 'renderer/partials/device/angularMessage.html!text';

let $compile;
let $rootScope;

export default class AngularMessageFeature {
  static start(runningDeviceCtrl) {
    runningDeviceCtrl.webViewElement.addEventListener('ipc-message', (event) => {
      if (event.channel === 'angular-exists' && !runningDeviceCtrl.app.angularMessage) {
        var scope = $rootScope.$new(true);

        scope.close = () => {
          runningDeviceCtrl.hideWidget();
          runningDeviceCtrl.app.angularMessage = true;
          $rootScope.$emit('request-to-save');
        };

        var element = $compile(template)(scope);

        runningDeviceCtrl.showWidget(element, {left: '50%', top: '50%',transform: 'translate(-50%,-50%)'}, true);
      }
    });

    runningDeviceCtrl.webViewElement.addEventListener('dom-ready', () => {
      runningDeviceCtrl.webViewElement.executeJavaScript(angularMessageInject);
    });
  }

  static factory(_$rootScope, _$compile) {
    $rootScope = _$rootScope;
    $compile = _$compile;
  }
}

AngularMessageFeature.factory.$inject = ['$rootScope', '$compile'];
