var path = require('path');

var express = require('express.io');
var open = require("open");

var reload = require('./lib/reload');

module.exports = function(obj) {
    var dir = obj.dir || 'www';
    var launch = obj.launch == true;
    var port = obj.port || 80;
    
    var app = express();
    app.http().io();

    app.get('/www/cordova.js', function (req, res) {
        res.set('Content-Type', 'application/javascript');
        res.end();
    });

    app.use('/www', express.static(dir));

    app.use(express.static(path.join(__dirname, 'public')));

    reload(app, dir);
    app.listen(port);
    
    if (launch) {
        open("http://localhost:" + port);
    }
}