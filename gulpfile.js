var gulp = require('gulp');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var gulpif = require('gulp-if');
var merge = require('merge-stream');
var del = require('del');
var nunjucks = require('nunjucks');
var cordova = require('cordova-lib').cordova;
var cordovajs = require('cordova-js/tasks/lib/bundle');
var fs = require('fs-extra');

var config = require('./config/config');
var server = require('./');

var DEV_DIR = 'dev/';
var PROD_DIR = 'dist/';

var buildEnv = 'dev';

function generateMain(file) {
    var env = new nunjucks.Environment();
    env.addFilter('json', function(obj, count) {
        return JSON.stringify(obj, null, count);
    });
    
    var template = file.contents.toString();

    for (var key in config.libs.dev) {
        if(config.libs.dev.hasOwnProperty(key)) {
            config.requirejs.paths[key] = config.libs.dev[key];
        }
    }

    config.deps = config.mainDeps.concat();

    config.apis.forEach(function(api) {
        config.deps.push('api/' + api + '/js/app');
    });

    for (var key in config.plugins) {
        if(config.plugins.hasOwnProperty(key)){
            config.deps.push('plugins/' + config.plugins[key].id + '/client/js/app');
        }
    }

    config.deps = config.deps.concat(config.css);

    var res = env.renderString(template, config);

    file.contents = new Buffer(res);
};

gulp.task('clean', function (done) {
    del(['dev', 'tmp', 'dist'], done);
});

gulp.task('copyFiles', ['clean'], function () {
    var simulator = gulp.src('./main.js')
            .pipe(tap(generateMain))
            .pipe(rename('js/main.js'))
            .pipe(addsrc('public/**/*'))
            .pipe(gulp.dest(DEV_DIR + 'public/'));
    
    var demo = gulp.src('./demo/**/*')
            .pipe(gulp.dest(DEV_DIR + '/demo'));
    
    var plugins = gulp.src('./plugins/**/*')
            .pipe(gulp.dest(DEV_DIR + '/plugins'));
    
    return merge(simulator, demo, plugins);
});

gulp.task('createCordova', ['clean'], function (done) {
    var plugins = [];
    for (var key in config.plugins) {
        if(config.plugins.hasOwnProperty(key)){
            plugins.push(config.plugins[key].url !== undefined ? config.plugins[key].url : config.plugins[key].id);
        }
    }
    
    cordova.raw.create('tmp', 'ozsay.cordovaSimulator.simulator', 'simulator').done(function() {
        var cwd = process.cwd();
        process.chdir('tmp');
        cordova.raw.platform('add', ['android']).done(function() {
            cordova.raw.plugin('add', plugins).done(function() {
                process.chdir(cwd);
                done();
            });
        });
    });
});

gulp.task('createCordovaJs', ['createCordova'], function (done) {
    fs.copy('cordova', 'node_modules/cordova-js/src', function (err) {
        if (!err) {
            var cwd = process.cwd();
            process.chdir('node_modules/cordova-js');
            var cordovaJsFile = cordovajs('simulator', false, 'custom commit', '3.7.0');
            process.chdir(cwd);
            fs.outputFile('tmp/platforms/android/assets/www/cordova.js', cordovaJsFile, done);
        } else {
            done(err);
        }
    });
});

gulp.task('copyCordova', ['createCordova', 'createCordovaJs'], function () {
    return gulp.src(['tmp/platforms/android/assets/www/cordova*.js', 
                     'tmp/platforms/android/assets/www/plugins/**/*.js'])
        .pipe(concat('cordova.js'))
        .pipe(gulpif(buildEnv !== "dev", uglify()))
        .pipe(gulp.dest(DEV_DIR + 'cordova/'));
});

gulp.task('cordova', ['createCordova', 'createCordovaJs', 'copyCordova'], function () {
});

gulp.task('serve', ['copyFiles', 'cordova'], function () {
    server({
        port: 80,
        launch: true,
        demo: true,
        apps: [],
        resources: [],
        dir: 'dev'
    });
});