var gulp = require('gulp')
  , bump = require('gulp-bump')
  , clean = require('gulp-clean')
  , stylus = require('gulp-stylus')
  , jshint = require('gulp-jshint')
  , livereload = require('gulp-livereload')
  , lr = require('tiny-lr')
  , server = lr();

gulp.task('css', function(){
  return gulp.src('src/css/content-edible.styl')
    .pipe(stylus({use: ['nib']}))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload(server));
});

gulp.task('js', function() {
  return gulp.src(['./public/src/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload(server));
});

gulp.task('clean', function() {
  return gulp.src(['./public/js/dist/'], {read: false})
    .pipe(clean());
});

// Increment packages by patch point
gulp.task('bump', function(){
  gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
  server.listen(35729, function (err) {
    if (err) return console.log(err);
    gulp.watch('./src/css/**/*.styl', ['css']);
    gulp.watch('./public/js/src/**/*.js', ['js']);
  });
});

gulp.task('default', ['clean'], function(){
  gulp.start('css', 'js');
});
