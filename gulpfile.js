var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  gulp.src(['index.js', 'test/index.spec.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

