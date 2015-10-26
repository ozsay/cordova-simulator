/*jshint esnext: true */

import angularMessageInject from './lalaland.txt!text';

export default class AngularMessageFeature {
  static start(runningDeviceCtrl) {
    runningDeviceCtrl.webViewElement.addEventListener('ipc-message', (event) => {
      if (event.channel === 'angular-exists') {
        console.log('ok');
      }
    });

    runningDeviceCtrl.webViewElement.addEventListener('dom-ready', () => {
      runningDeviceCtrl.webViewElement.executeJavaScript(angularMessageInject);
    });
  }
}
