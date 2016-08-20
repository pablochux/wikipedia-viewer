// Plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    pump = require('pump'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Directories
var src = 'template/src/',
    minsrc = 'template/dist/';

// ---------
// Development
// ---------
// Default task starts the server in the src folder (development)
gulp.task('default', function(){
	browserSync.init({
        server: {
            baseDir: [src, '.tmp'],
            routes:  {
                '/bower_components': 'bower_components'
            }
        },
		browser: "Google Chrome Canary",
		notify: false
	});

	gulp.watch(src + "scss/*.scss", ['sass']);
	gulp.watch(src + "scss/*.scss").on("change", reload);
	gulp.watch(src + "*.html").on("change", reload);
	gulp.watch(src + "js/**/*.js").on("change", reload);
});

// Compile the sass files into css files
// Problema: por defecto se compilan todos los archivos en distintos archivos por lo que hay ficheros que se quedan en src/css (animaciones, default, etc)
// Problema no resuelto, se siguen duplicando las cosas. Porque al hacer import se imortan toda las cosas pero luego al hacer el concat, se concatenan todas de nuevo.
gulp.task("sass", function() {
    gulp.src(src + "scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css')) // this is what was missing
    .pipe(gulp.dest(src + 'css/')); // output to theme root
});
// Minify css
gulp.task('minify-css', function(){
    return gulp.src(src + 'css/styles.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(minsrc + 'css'));
});
// Autoprefix all the css
gulp.task('prefix', function(){
    gulp.src(minsrc + 'css/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(minsrc + 'css/'));
});
// Add bower componentes
gulp.task('add-b', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulp.dest('./wwwroot/libs'));
});
// Concat all the js files
gulp.task('concat-js', function() {
  return gulp.src(src + 'js/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest(src + 'js/'));
});
// Minify js
gulp.task('minify-js', function (cb) {
  pump([
        gulp.src(src + 'js/script.js'),
        uglify(),
        gulp.dest(minsrc + 'js/')
    ],
    cb
  );
});
// Minify html
gulp.task('minify-html', function() {
  return gulp.src(src + '*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(minsrc));
});
// Compress images in src/img folder
gulp.task('compress-img', function(){
	gulp.src(src + 'img/*')
		.pipe(imagemin())
		.pipe(gulp.dest(minsrc + 'img'));
});
// Clean the finish proyect
gulp.task('c-d', function () {
  return del([
    minsrc + '*.html',
    minsrc + '/js/*.js',
    minsrc + '/css/*.css',
    minsrc + '/img/*'
  ]);
});

// --------------
// PRODUCTION
// First prefix, then clean the dist folder, then do all the finish tasks
// --------------
gulp.task('c-d', ['f-prefix'], function () {
  return del([
    minsrc + '*.html',
    minsrc + '/js/*.js',
    minsrc + '/css/*.css',
    minsrc + '/img/*'
  ]);
});
// Autoprefix all the css
gulp.task('f-prefix', function(){
    gulp.src(src + 'css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(src + 'css/'));
});
// Minify css
gulp.task('f-minify-css', ['c-d'], function(){
    return gulp.src(src + 'css/styles.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(minsrc + 'css'));
});
// Concat all the js files
gulp.task('f-concat-js', ['c-d'], function() {
  return gulp.src(src + 'js/*.js')
    .pipe(concat('script.js'))
    .pipe(gulp.dest(src + 'js/'));
});
// Minify js
gulp.task('f-minify-js', ['c-d'], function (cb) {
  pump([
        gulp.src(src + 'js/script.js'),
        uglify(),
        gulp.dest(minsrc + 'js/')
    ],
    cb
  );
});
// Minify html
gulp.task('f-minify-html', ['c-d'], function() {
  return gulp.src(src + '*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(minsrc));
});
// Compress images in src/img folder
gulp.task('f-compress-img', ['c-d'], function(){
	gulp.src(src + 'img/*')
		.pipe(imagemin())
		.pipe(gulp.dest(minsrc + 'img'));
});
// Starts the server in the dist foler for testing
gulp.task('check-dist', function() {
	browserSync.init({
        server: {
            baseDir: [minsrc, '.tmp'],
            routes:  {
                '/bower_components': 'bower_components'
            }
        },
		browser: "Google Chrome Canary",
		notify: false,
        routes:{
                    "../../bower_components" : "bower_components"
                }
	});

	gulp.watch(src + "scss/*.scss", ['sass']);
	gulp.watch(src + "scss/*.scss").on("change", reload);
	gulp.watch(src + "*.html").on("change", reload);
	gulp.watch(src + "js/*.js").on("change", reload);
});

// FINISH TASK
gulp.task('f', ['f-concat-js', 'f-minify-js', 'f-minify-css', 'f-minify-html', 'f-compress-img', 'check-dist'], function() {
	console.log("Created dist folder with dist files. -> PRODUCTION!");
});
