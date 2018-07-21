let isWATCH = false;

var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var concat = require('gulp-concat');
var clean = require('gulp-clean');

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
	.pipe(gulp.dest('./build/'));
});

gulp.task('browserify', function () {
	return browserify({
		basedir: '.',
		debug: true,
		entries: ['resources/src/main.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest("build"));
});

gulp.task('init', ['copy-assets', 'copy-css', 'copy-fonts', 'copy-lib', 'browserify', 'copy-html']);


if (isWATCH) {
	// ------- WATCHIFY
	var watchify = require("watchify");
	var gutil = require("gulp-util");

	var watchedBrowserify = watchify(browserify({
		basedir: '.',
		debug: true,
		entries: ['resources/src/main.ts'],
		cache: {},
		packageCache: {}
	}).plugin(tsify));


	function bundle() {
		return watchedBrowserify
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest("build"));
	}

	gulp.task("default", bundle);
	watchedBrowserify.on("update", bundle);
	watchedBrowserify.on("log", gutil.log);
} else {
	gulp.task('default', [ 'browserify' ]);
}
