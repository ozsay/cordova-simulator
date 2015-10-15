/*jshint esnext: true */

let app = require('app');
let BrowserWindow = require('browser-window');
let menu = require('menu');

let path = require('path');
let url = require('url');

const CORDOVA_SCRIPT_PATH = path.normalize(__dirname + '/../browser/js/cordova.js');

var mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform == 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  let protocol = require('protocol');

  protocol.registerStandardSchemes(['simulator-file']);

  protocol.registerFileProtocol('simulator-file', (request, callback) => {
    var filePath = url.parse(request.url);
    var fileName = path.basename(filePath.pathname);

    var pathToServe = fileName === 'cordova.js' ? CORDOVA_SCRIPT_PATH : filePath.pathname;

    callback(pathToServe);
  }, (error) => {
    if (error)
    console.error('Failed to register protocol');
  });

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
