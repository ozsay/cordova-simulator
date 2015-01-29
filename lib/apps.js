var fs = require('fs');
var path = require('path');

var express = require('express.io');

module.exports = function(app, appsToServe, reload) {
    appsToServe.forEach(function(_app) {
        /*app.get('/apps/' + _app.name + '/cordova.js', function (req, res) {
            res.set('Content-Type', 'application/javascript');
            res.end();
        });*/
        
        app.use('/apps/' + _app.name, express.static(_app.path));
        
        if (reload) {
            fs.watch(_app.path, function () {
                app.io.broadcast('reload', _app);
            });
        }
    });

    app.io.route('apps', function(req) {
        req.io.emit('appsResponse', appsToServe);
    });
}