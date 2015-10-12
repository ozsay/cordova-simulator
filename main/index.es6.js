/*jshint esnext: true */

let app = require('app');
let BrowserWindow = require('browser-window');
let menu = require('menu');

var mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform == 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 780
  });

  mainWindow.maximize();

  mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');
  //menu.setApplicationMenu(null);
  mainWindow.openDevTools();

  mainWindow.webContents.on('did-finish-load',() =>{
    mainWindow.setTitle(app.getName());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
