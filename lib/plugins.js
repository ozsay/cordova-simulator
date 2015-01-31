var path = require('path');

var express = require('express.io');

module.exports = function(app, baseDir) {
    app.use('/plugins', express.static(path.join(baseDir, 'plugins')));
}