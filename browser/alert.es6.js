/*jshint esnext: true */

let ipc = require('ipc');
let dialog = require('dialog');

let mainWindow;
let remote = false;

let openMessage = (type, title, message, buttons) => {
  dialog.showMessageBox(mainWindow, {
    type: type,
    title: title,
    message: message,
    buttons: buttons || ['Ok']
  });
};

let sendRemoteMessage = (type, title, message) => {
  mainWindow.webContents.send('alert-from-main', type, title, message);
};

export default {
  setWindow: (_mainWindow) => {
    mainWindow = _mainWindow;

    ipc.on('alerts-loaded', (event, arg) => {
      remote = true;
    });
  },

  info: (title, message) => {
    if (!remote) {
      openMessage('info', title, message);
    } else {
      sendRemoteMessage('info', title, message);
    }
  },

  warning: (title, message) => {
    if (!remote) {
      openMessage('warning', title, message);
    } else {
      sendRemoteMessage('warning', title, message);
    }
  },

  error: (title, message) => {
    if (!remote) {
      openMessage('error', title, message);
    } else {
      sendRemoteMessage('error', title, message);
    }
  }
};
