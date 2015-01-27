var path = require('path');

var express = require('express.io');
var open = require("open");

var appsServing = require('./lib/apps');
var resourcesServing = require('./lib/resources');

module.exports = function(properties) {
    if (properties.demo) {
        properties.apps.push({
            name: 'demo',
            path: path.join(__dirname, 'demo')
        });
    }
    
    var app = express();
    app.http().io();

    appsServing(app, properties.apps, true);
    resourcesServing(app, properties.resources);
    
    app.use(express.static(path.join(__dirname, 'public')));

    app.listen(properties.port);
    
    if (properties.launch) {
        open("http://localhost:" + properties.port);
    }
}