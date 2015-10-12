var exec   = require('child_process').exec,
    del    = require('del'),
    gulp   = require('gulp'),
    babel  = require('gulp-babel'),
    rename = require('gulp-rename');

gulp.task('clean', function () {
    return del(['main/index.js']);
});

gulp.task('app:transpile', function() {
  return gulp.src('main/index.es6.js')
    .pipe(babel())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('main'));
});

gulp.task('app:run', ['app:transpile'], function(cb) {
  exec('electron .', function(err) {
      if (err) return cb(err);
      cb();
    });
});

gulp.task('plugin:add', function () {
});
