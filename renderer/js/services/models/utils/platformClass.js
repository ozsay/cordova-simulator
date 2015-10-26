/*jshint esnext: true */

import platformClassInject from './platformClassInject.js!text';

export default class PlatformClassFeature {
  static start(runningDeviceCtrl) {
    runningDeviceCtrl.webViewElement.addEventListener('dom-ready', () => {
      runningDeviceCtrl.webViewElement.executeJavaScript(platformClassInject.replace('$$$', runningDeviceCtrl.device.preset.platform));
    });
  }
}
