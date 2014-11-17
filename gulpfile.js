var gulp = require('gulp'),
    bump = require('gulp-bump'),
    rename = require('gulp-rename'),
    to5 = require('gulp-6to5'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();


gulp.task('js', function() {
  return gulp.src(['./**/content-edible.*'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('jshint-stylish'))
    .pipe(livereload(server));
});

gulp.task('6to5', function () {
  return gulp.src('./**/*.es6')
    .pipe(to5({modules: "umd"}))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('./'));
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
    gulp.watch(['./**/*.es6'], ['6to5']);
    gulp.watch(['./content-edible.js','./test/content-edible.js'], ['js']);
  });
});

gulp.task('default', function(){
  gulp.start('js');
});
