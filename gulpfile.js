let isWATCH = false;

var gulp = require("gulp");
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var gutil = require('gulp-util');

gulp.task('clear', function () {
	return gulp.src('build/*', {read: false})
	.pipe(clean());
});

gulp.task('clear-assets', function () {
	return gulp.src('build/assets/*', {read: false})
	.pipe(clean());
});

gulp.task('copy-assets', ['clear-assets'], function() {
	return gulp.src('./resources/assets/*')
	.pipe(gulp.dest('./build/assets'));
});

gulp.task('clear-fonts', function () {
	return gulp.src('build/css/fonts/*', {read: false})
	.pipe(clean());
});

gulp.task('copy-fonts', ['clear-fonts'], function() {
	return gulp.src('./resources/styles/fonts/*')
	.pipe(gulp.dest('./build/css/fonts'));
});

gulp.task('clear-css', function () {
	return gulp.src('build/css/*.css', {read: false})
	.pipe(clean());
});

gulp.task('copy-css', ['clear-css'], function() {
	return gulp.src('./resources/styles/*.css')
	.pipe(gulp.dest('./build/css/'));
});

gulp.task("copy-html", function () {
	return gulp.src('./resources/*.html')
	.pipe(gulp.dest("./build/"));
});

gulp.task('copy-lib', function() {
  return gulp.src('./resources/lib/*.js')
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('./build/js/'));
});

gulp.task('generate-js', function() {
	return gulp.src(['./resources/src/*.*'])
		.pipe(sourcemaps.init())
		.pipe(typescript({
			target: "es5",
			noImplicitAny: true,
			out: 'bundle.js',
			lib: [
			  "dom",
			  "es7"
			],
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./build/js/"))
		.on('error', gutil.log);
});

gulp.task('init', ['clear'], function() {
	return gulp.start('copy-assets')
		.start('copy-css')
		.start('copy-fonts')
		.start('copy-lib')
		.start('copy-html')
		.start('generate-js')
});



if (isWATCH) {

} else {
	gulp.task('default', ['generate-js']);
}
