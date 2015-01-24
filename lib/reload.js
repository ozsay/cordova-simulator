var fs = require('fs');

module.exports = function(app, path) {
    fs.watch(path, function () {
        app.io.broadcast('reload');
    });
}