var exec      = require('child_process').exec,
    del       = require('del'),
    gulp      = require('gulp'),
    babel     = require('gulp-babel'),
    rename    = require('gulp-rename'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    gulpif    = require('gulp-if'),
    fs        = require('fs-extra'),
    yargs     = require('yargs'),
    cordova   = require('cordova-lib').cordova,
    cordovajs = require('cordova-js/tasks/lib/bundle');

var pjson = require('./package.json');
var argv = yargs.argv;

var env = argv.p ? 'prod' : 'dev';

gulp.task('clean', function () {
    return del(['main/index.js', 'tmp', 'browser/js/cordova.js', 'node_modules/cordova-js/src/legacy-exec/simulator']);
});

gulp.task('app:transpile', function() {
  return gulp.src('./**/*.es6.js')
    .pipe(babel())
    .pipe(rename(function (path) {
      path.basename = path.basename.substr(0, path.basename.length - 4);
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('app:run', ['app:transpile'], function(cb) {
  exec('electron .', function(err) {
      if (err) return cb(err);
      cb();
    });
});

gulp.task('app:debug', ['app:transpile'], function(cb) {
  exec('electron --debug=5858 .', function(err) {
      if (err) return cb(err);
      cb();
    });
});

gulp.task('plugin:add', function (cb) {
  if (argv.n !== undefined && (argv.i !== undefined || argv.u !== undefined)) {
    pjson.cordovaPlugins[argv.n] = {};

    if (argv.i !== undefined) {
      pjson.cordovaPlugins[argv.n].id = argv.i;
    } else {
      pjson.cordovaPlugins[argv.n].url = argv.u;
    }

    fs.writeJson('package.json', pjson, {spaces: 2}, function(err) {
      cb(err);
    });
  }
});

gulp.task('cordova:create', ['clean'], function (cb) {
  var plugins = [];
  for (var key in pjson.cordovaPlugins) {
    if(pjson.cordovaPlugins.hasOwnProperty(key)){
      plugins.push(pjson.cordovaPlugins[key].id ||  pjson.cordovaPlugins[key].url);
    }
  }

  cordova.raw.create('tmp', 'ozsay.cordovaSimulator.simulator', 'simulator').done(function() {
    var cwd = process.cwd();
    process.chdir('tmp');
    cordova.raw.platform('add', ['android']).done(function() {
      if (plugins.length > 0) {
        cordova.raw.plugin('add', plugins).done(function() {
          process.chdir(cwd);
          cb();
        });
      } else {
        process.chdir(cwd);
        cb();
      }
    });
  });
});

gulp.task('cordovaJs:create', ['cordova:create'], function (done) {
    fs.copy('cordova/simulator', 'node_modules/cordova-js/src/legacy-exec/simulator', function (err) {
        if (!err) {
            var cwd = process.cwd();
            process.chdir('node_modules/cordova-js');
            var cordovaJsFile = cordovajs('simulator', false, 'custom commit', '4.1.1');
            process.chdir(cwd);
            fs.outputFile('tmp/platforms/android/assets/www/cordova.js', cordovaJsFile, done);
        } else {
            done(err);
        }
    });
});

gulp.task('cordovaJs:copy', ['cordovaJs:create'], function () {
    return gulp.src(['tmp/platforms/android/assets/www/cordova*.js',
                     'tmp/platforms/android/assets/www/plugins/**/*.js',
                     'cordova/proxy.js'])
        .pipe(concat('cordova.js'))
        .pipe(gulpif(env !== "dev", uglify()))
        .pipe(gulp.dest('browser/js/'));
});

gulp.task('build', ['cordovaJs:copy'], function() {
});
