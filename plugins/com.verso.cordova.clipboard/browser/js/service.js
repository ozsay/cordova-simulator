/*jshint esnext: true */

let plugins;

export default class ClipboardPlugin {
  constructor(_plugins) {
    plugins = _plugins;

    plugins.registerCommand('Clipboard', 'copy', this.copy);
    plugins.registerCommand('Clipboard', 'paste', this.paste);
  }

  copy(sender, text) {
    sender.device.status.clipboard = text;
  }

  paste(sender) {
    return sender.device.status.clipboard;
  }
}

ClipboardPlugin.$inject = ['plugins'];
