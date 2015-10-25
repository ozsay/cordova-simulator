/*jshint esnext: true */

let plugins;

export default class AppVersionPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('AppVersion', 'getVersionNumber', this.getVersionNumber);
    plugins.registerCommand('AppVersion', 'getAppName', this.getAppName);
    plugins.registerCommand('AppVersion', 'getPackageName', this.getPackageName);
    plugins.registerCommand('AppVersion', 'getVersionCode', this.getVersionCode);
  }

  getVersionNumber(sender) {
    return sender.app.configXml.widget.$.version;
  }

  getAppName(sender) {
    return sender.app.configXml.widget.name[0];
  }

  getPackageName(sender) {
    return sender.app.configXml.widget.$.id;
  }

  getVersionCode(sender) {
    function androidVersion() {
      var version = sender.app.configXml.widget.$.version.split('.');

      return parseInt(version[2]) + parseInt(version[1]) * 100 + parseInt(version[0]) * 10000;
    }

    var code;
    if (sender.device.preset.platform === 'ios') {
      code = sender.app.configXml.widget.$['ios-CFBundleVersion'] || sender.app.configXml.widget.$.version;
    } else if (sender.device.preset.platform === 'android') {
      code = sender.app.configXml.widget.$['android-versionCode'] || androidVersion();
    }

    return code;
  }
}

AppVersionPlugin.$inject = ['plugins'];
