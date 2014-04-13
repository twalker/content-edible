var gulp = require('gulp')
  , bump = require('gulp-bump')
  , jshint = require('gulp-jshint')
  , livereload = require('gulp-livereload')
  , lr = require('tiny-lr')
  , server = lr();

gulp.task('js', function() {
  return gulp.src(['./content-edible.js','./test/content-edible.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(livereload(server));
});

// Increment packages by patch point
gulp.task('bump', function(){
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
  server.listen(35729, function (err) {
    if (err) return console.log(err);
    gulp.watch(['./content-edible.js','./test/content-edible.js'], ['js']);
  });
});

gulp.task('default', function(){
  gulp.start('js');
});
