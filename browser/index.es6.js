/*jshint esnext: true */

let app = require('app');
let BrowserWindow = require('browser-window');
let menu = require('menu');
let globalShortcut = require('global-shortcut');

let protocolsInit = require('./protocols.js');
let alert = require('./alert.js');
let versions = require('./versions.js');

var mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform == 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  protocolsInit((err) => {
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 780
    });

    alert.setWindow(mainWindow);

    mainWindow.setTitle('Cordova Simulator');
    mainWindow.maximize();

    mainWindow.loadUrl('file://' + __dirname + '/../renderer/index.html');
    menu.setApplicationMenu(null);

    globalShortcut.register('ctrl+r', function() {
      mainWindow.reload();
    });

    mainWindow.openDevTools();

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  });
});
