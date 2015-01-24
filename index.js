var path = require('path');

var express = require('express.io');
var open = require("open");

var reload = require('./lib/reload');

module.exports = function(obj) {
    var app = express();

    app.http().io();

    app.get('/www/cordova.js', function (req, res) {
        res.set('Content-Type', 'application/javascript');
        res.end();
    });

    app.use('/www', express.static(obj.dir));

    app.use(express.static(path.join(__dirname, 'public')));

    reload(app, obj.dir);
    app.listen(obj.port);
    
    if (obj.launch) {
        open("http://localhost:" + obj.port);
    }
}