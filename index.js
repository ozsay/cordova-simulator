var path = require('path');

var express = require('express.io');
var open = require('open');

var appsServing = require('./lib/apps');
var resourcesServing = require('./lib/resources');
var pluginsServing = require('./lib/plugins');

module.exports = function(properties) {
    var filesDir = path.join(__dirname, properties.dir);
    
    if (properties.demo) {
        properties.apps.push({
            name: 'demo',
            path: path.join(filesDir, 'demo')
        });
    }
    
    var app = express();
    app.http().io();

    appsServing(app, properties.apps, true, filesDir);
    resourcesServing(app, properties.resources);
    pluginsServing(app, filesDir);
    
    app.use(express.static(path.join(filesDir, 'public')));

    app.listen(properties.port);
    
    if (properties.launch) {
        open('http://localhost:' + properties.port);
    }
}