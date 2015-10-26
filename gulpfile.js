'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	changed = require('gulp-changed'),
	connect = require('gulp-connect'),
	clean = require('gulp-clean'),
	bower = require('gulp-bower'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	typescript = require('gulp-typescript'),
	tsd = require('gulp-tsd'),
//jsdoc = require("gulp-jsdoc"),
	template = require('gulp-template'),
	runSequence = require('run-sequence'),
	componentsDir = 'bower_components/',
	rootDir = 'public/',
	vendorDir = 'vendor/',
	templateModulesDir = 'modules/',
	templateComponentsDir = 'components/',
	assetsDir = 'assets/',
	appDir = 'app/',
	cssDir = 'css/',
	configFile = 'config.json',
	streamqueue = require('streamqueue'),
	settings = {
		componentDir: "bower_components/",
		configDir: "src/config/"
	};

gulp.task('bower', ['default'], function () {
	return bower();
});

//gulp.task('jsdoc', function () {
//    gulp.src([appDir + 'app.eventBus.js', "README.md"])
//        .pipe(jsdoc('doc'))
//});

gulp.task('jshint', function () {
	return gulp.src(appDir + '*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('jscs', function () {
	return gulp.src(appDir + '*.js')
		.pipe(jscs());
});

gulp.task('scripts.app', function () {
	var source = [
		'**/*.ts'
	].map(function (dir) {
			return appDir + dir;
		});

	return gulp.src(source)
		.pipe(typescript({
			target: 'es5',
			declarationFiles: true,
			noExternalResolve: false,
			sortOutput: true
		}))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(rootDir + vendorDir + 'js/'))
		.pipe(connect.reload());


	//return gulp.src(source)
	//	.pipe(concat('app.js'))
	//	.pipe(template({
	//		templateModulesDir: vendorDir + templateModulesDir,
	//		templateComponentsDir: vendorDir + templateComponentsDir
	//	}))
	//	.pipe(gulp.dest(rootDir + vendorDir + 'js/'))

});

gulp.task('scripts.vendor', function () {


	var source = [
		'phaser/build/phaser.min.js',
		'pixi/bin/pixi.min.js'
	].map(function (dir) {
			return componentsDir + dir;
		});

	return gulp.src(source)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(rootDir + vendorDir + 'js/'))
		.pipe(connect.reload());
});

gulp.task('css', function () {
	var source = [
		cssDir + '**/**.css'
	].map(function (dir) {
			return appDir + assetsDir + dir;
		});

	return gulp.src(source)
		.pipe(concat('css.css'))
		.pipe(gulp.dest(rootDir + vendorDir + 'css'))
		.pipe(connect.reload());
});
gulp.task('css.vendor', function () {
	var source = [
		'semantic/dist/semantic.css'
	].map(function (dir) {
			return componentsDir + dir;
		});

	return gulp.src(source)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(rootDir + vendorDir + 'css'))
		.pipe(connect.reload());
});

gulp.task('fonts', function () {
	return gulp.src(appDir + assetsDir + 'fonts/*.{ttf,woff,woff2,eot,svg}')
		.pipe(gulp.dest(rootDir + vendorDir + 'fonts/'))
		.pipe(connect.reload());
});

gulp.task('images', function () {
	return gulp.src(appDir + assetsDir + 'images/**/*.{png,jpg}')
		.pipe(gulp.dest(rootDir + vendorDir + 'images/'))
		.pipe(connect.reload());
});

gulp.task('templates.direct', function () {
	return gulp.src(appDir + '**/*.html')
		.pipe(changed(rootDir + vendorDir))
		.pipe(gulp.dest(rootDir + vendorDir))
		.pipe(connect.reload());
});

gulp.task('server', function () {
	connect.server({
		root: '',
		port: 9090,
		livereload: true
	});
});

gulp.task('clean', function () {
	return gulp.src(rootDir + vendorDir, {read: false})
		.pipe(clean());
});

gulp.task('config', function () {
	return gulp.src(appDir + configFile)
		.pipe(gulp.dest(rootDir))
		.pipe(connect.reload());
});

gulp.task('watch', ['clean'], function () {
	gulp.watch('app/**/*.ts', ['scripts.app']);
	gulp.watch(appDir + assetsDir + cssDir + '*.css', ['css']);
	gulp.watch('**/*.html', ['templates.direct']);
	gulp.watch(rootDir + vendorDir + 'index.html', ['templates.direct']);
});
gulp.task('tsd', function () {
	return gulp.src('./gulp_tsd.json').pipe(tsd());
});

gulp.task('default', function () {
	runSequence('bower', 'dev');
});

gulp.task('dev', ['clean'], function () {
	gulp.start('scripts.app', 'scripts.vendor', 'css', 'css.vendor', 'tsd',
		'templates.direct', 'server', 'watch', 'fonts', 'images', 'config');
	gutil.log('tasks is completed');
});

gulp.task('build', ['clean'], function () {
	gulp.start('scripts.app', 'scripts.vendor', 'css', 'css.vendor', 'tsd', 'templates.direct', 'fonts', 'images', 'config');
	gutil.log('tasks is completed');
});

gulp.task('code-analytics', function () {
	gulp.start('jshint', 'jscs');
	gutil.log('tasks is completed');
});
