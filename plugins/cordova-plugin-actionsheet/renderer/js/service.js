/*jshint esnext: true */

let plugins;

export default class ActionSheetPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('ActionSheet', 'show', this.show);
    plugins.registerCommand('ActionSheet', 'hide', this.hide);
  }

  show(sender, options) {
    return sender.device.showActionSheet(sender, options);
  }

  hide(sender) {
    sender.device.hideActionSheet(sender);
  }
}

ActionSheetPlugin.$inject = ['plugins'];
