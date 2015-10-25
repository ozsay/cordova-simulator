/*jshint esnext: true */

let plugins;

export default class NetworkInformationPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('NetworkStatus', 'getConnectionInfo', this.getConnectionInfo, true);
  }

  getConnectionInfo(sender, request) {
    function getStatus() {
      return sender.device.status.wifi ? 'wifi' : (sender.device.status.network || 'none');
    }

    sender.watch(() => sender.device.status.wifi, () => {
      sender.sendToDevice(request, true, getStatus());
    });

    sender.watch(() => sender.device.status.network, () => {
      sender.sendToDevice(request, true, getStatus());
    });

    return {
      keepRequest: true,
      data: getStatus()
    };
  }
}

NetworkInformationPlugin.$inject = ['plugins'];
