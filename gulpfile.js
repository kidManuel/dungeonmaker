// Include gulp
var gulp = require('gulp');
var stylish = require('jshint-stylish');
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var devScriptImports = /<!-- script imports [^]*end -->/g
var distScriptImports = '<script src="js/all.js"></script>'
var devStyleImports = /<!-- style imports [^]*end -->/g
var distStyleImports = '<link href="css/all.css" rel="stylesheet"></script>'
var webserver = require('gulp-webserver');
 
gulp.task('serve', function() {
  gulp.src('dev')
    .pipe(webserver({
      livereload: false,
      open: true
    }));
});

gulp.task('lint', function() {
    return gulp.src('dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('prettify', function() {
    return gulp.src(['./dev/css/*.css', './dev/*.html', './dev/js/*.js'], {base: 'dev'})
        .pipe(prettify())
        .pipe(prettify.reporter())
        .pipe(gulp.dest('./dev/'));
});

gulp.task('prepScript', function() {
    return gulp.src('./dev/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('prepStyle', function() {
    return gulp.src('./dev/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('prepImages', function() {
    return gulp.src(['./dev/imgs/*.png', './dev/imgs/*.jpg'])
        .pipe(gulp.dest('dist/imgs'))
});

gulp.task('prepStage', function() {
    return gulp.src('./dev/*.html')
    	.pipe(replace(devScriptImports, distScriptImports))
    	.pipe(replace(devStyleImports, distStyleImports))
        .pipe(gulp.dest('dist'))
});






//NON DEFINITIVE GULP PREP
gulp.task('distPrep', ['prepScript', 'prepStyle', 'prepImages', 'prepStage']);

