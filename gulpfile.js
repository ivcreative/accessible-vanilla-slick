var gulp = require('gulp');
var uglifyJS = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass')(require('sass'));
var minifyCSS = require('gulp-clean-css');
var del = require('del');

// Remove old files
gulp.task('clean', function() {
  return del(['slick/dist/*.min.*']);
});

// Build the CSS from SCSS
gulp.task('build:css', function() {
  return gulp.src(['slick/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest('slick/dist'));
});

// Build the JavaScript from src/index.js (which bundles everything)
gulp.task('build:js', function() {
  return gulp.src(['slick/dist/slick.js'])
    .pipe(uglifyJS())
    .pipe(rename('slick.min.js'))
    .pipe(gulp.dest('slick/dist'));
});

// Watch source files for changes and automatically rebuild them when changes are saved
gulp.task('watch', function() {
  gulp.watch('slick/*.scss', gulp.series(['build:css']));
  gulp.watch(['slick/dist/slick.js', '!slick/dist/*.min.js'], gulp.series(['build:js']));
});

// Default task executes a fresh build
gulp.task('default', gulp.series('clean','build:css','build:js'));