const gulp = require('gulp'),
      jade = require('gulp-jade'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      watch = require('gulp-watch'),
      pretty = require('gulp-pretty-html');
sass.compiler - require('node-sass');

gulp.task('jade', function(){
  return gulp.src('/website*.jade')
  .pipe(jade())
  .pipe(pretty())
  .pipe(gulp.dest('./website/dist/'))
});

gulp.task('sass', function(){
  return gulp.src('css/*.+(sass|scss)')
      .pipe(concat('style.sass'))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css/'))
});

gulp.task('watch', function() {
  return gulp.watch('./website/*.+(jade|sass|scss|js|html)', ['sass','jade'])
});