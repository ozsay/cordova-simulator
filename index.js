var path = require('path');

var express = require('express.io');

var reload = require('./lib/reload');

var app = express();
var dir = 'www';
app.http().io();

app.get('/www/cordova.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.end();
});

app.use('/www', express.static(dir));

app.use(express.static(path.join(__dirname, 'public')));

reload(app, dir);
app.listen(80);