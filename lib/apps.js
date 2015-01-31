var fs = require('fs');
var path = require('path');

var express = require('express.io');

module.exports = function(app, appsToServe, reload, baseDir) {
    var serveCordova = express.static(path.join(baseDir, 'cordova'));
    
    appsToServe.forEach(function(_app) {
        app.use('/apps/' + _app.name, express.static(_app.path));
        
        app.use('/apps/' + _app.name, function(req, res, next) {
            req.url = req.url.replace('/apps/' + _app.name, '/');
            
            serveCordova(req, res, next);
        });
        
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