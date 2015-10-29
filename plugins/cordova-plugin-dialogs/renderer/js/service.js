/*jshint esnext: true */

let plugins;

export default class DialogsPlugin {
  constructor( _plugins) {
    plugins = _plugins;

    plugins.registerCommand('Notification', 'alert', this.alert);
    plugins.registerCommand('Notification', 'beep', this.beep);
    plugins.registerCommand('Notification', 'confirm', this.confirm);
    plugins.registerCommand('Notification', 'prompt', this.prompt);
  }

  alert(sender, message, title, button) {
    return sender.device.alert(sender, message, title, button);
  }

  confirm(sender, message, title, buttons) {
    return sender.device.confirm(sender, message, title, buttons);
  }

  prompt(sender, message, title, buttons, defaultText) {
    return sender.device.prompt(sender, message, title, buttons, defaultText);
  }

  beep(sender, times) {
    sender.device.beep(times);
  }
}

DialogsPlugin.$inject = ['plugins'];
