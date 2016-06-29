var mocha = require('gulp-mocha'),
  gulp = require('gulp');
var paths = {
  tests: ['./test/']
};

gulp.task('test', function() {
  return gulp.src(paths.tests, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});
