var gulp = require('gulp');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var addsrc = require('gulp-add-src');
var watch = require('gulp-watch');
var rjs = require('requirejs');
var merge = require('merge-stream');
var del = require('del');
var nunjucks = require('nunjucks');
var cordova = require('cordova-lib').cordova;
var cordovajs = require('cordova-js/tasks/lib/bundle');
var fs = require('fs-extra');
var path = require('path');

var argv = require('yargs')
    .options('port', {
            default : 80
        })
    .options('d', {
                alias : 'dev',
                default : false
            })
    .options('s', {
                alias : 'site',
                default : false
            })
    .options('p', {
                alias : 'production',
                default : false
            })
    .check(function(argv) {
        if (argv.production) {
            buildEnv = "prod";
            destDir = "dist/";
        } else if (argv.site) {
            buildEnv = "site";
            destDir = "dist/";
        } else {
            buildEnv = "dev";
            destDir = "dev/";
        }
    })
    .argv;

var config = require('./config/config');
var server = require('./');

var buildEnv;
var destDir;
var cwd = process.cwd();

function generateMain(file) {
    var env = new nunjucks.Environment();
    env.addFilter('json', function(obj, count) {
        return JSON.stringify(obj, null, count);
    });
    
    var template = file.contents.toString();

    for (var key in config.libs) {
        if(config.libs.hasOwnProperty(key)) {
            config.requirejs.paths[key] = config.libs[key];
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

    var res = env.renderString(template, config);

    file.contents = new Buffer(res);
};

gulp.task('clean', function (done) {
    del(['dev', 'tmp', 'dist'], done);
});

gulp.task('demo', ['clean'], function () {
    return gulp.src('./demo/**/*')
            .pipe(gulp.dest(destDir + '/demo'));
});

gulp.task('simulator', ['clean'], function () {
    var simulator = gulp.src('./main.js')
            .pipe(tap(generateMain))
            .pipe(rename('js/main.js'))
            .pipe(addsrc('public/**/*'))
            .pipe(gulp.dest(destDir + 'public/'));

    var plugins = gulp.src('./plugins/**/*')
            .pipe(gulp.dest(destDir + '/public/plugins'));

    return merge(simulator, plugins);
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

gulp.task('plugin', [], function (done) {
    if (argv.add && argv.i !== undefined && argv.n !== undefined) {
        var plugin = [argv.u !== undefined ? argv.u : argv.i];
        
        var cwd = process.cwd();
        process.chdir('tmp');
        cordova.raw.plugin('add', plugin).done(function() {
            process.chdir(cwd);
            
            config.plugins[argv.n] = {
                id: argv.i,
                url: argv.u
            };
            
            fs.writeJson('./config/config.json', config, done);
        });
    }
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
        .pipe(gulp.dest(destDir + 'public/'));
});

gulp.task('cordova', ['createCordova', 'createCordovaJs', 'copyCordova'], function () {
});

gulp.task('serve', [], function () {
    server({
        port: argv.port,
        launch: true,
        demo: true,
        apps: [],
        resources: [],
        dir: 'dist'
    });
    
    var watch1 = watch('public/**/*', {verbose: true}).pipe(gulp.dest('dev/public/'));
    var watch2 = watch('plugins/**/*', {verbose: true}).pipe(gulp.dest('dev/public/plugins'));
    var watch3 = watch('demo/**/*', {verbose: true}).pipe(gulp.dest('dev/demo'));
    
    return merge(watch1, watch2, watch3);
});

gulp.task('build', ['simulator', 'cordova', 'demo'], function (done) {
    var dir = destDir + "public/";
    
    if (buildEnv === "prod") {
        config.requirejs.baseUrl = dir;
        config.requirejs.name = "js/main";

        for (var key in config.libs) {
            if(config.libs.hasOwnProperty(key)) {
                config.requirejs.paths[key] = 'empty:';
            }
        }

        config.requirejs.optimize = "uglify2";
        config.requirejs.out = function(script) {
            fs.writeFileSync(dir + "js/main.js", script);
            
            del([dir + "api", dir + "plugins", dir + "js/!(main.js)"], done);
        }
        
        rjs.optimize(config.requirejs);
    }
});