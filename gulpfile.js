
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $  = require('gulp-load-plugins')();
var del  = require('del');
var runSequence   = require('run-sequence');

// browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('sass', function() {

    return gulp.src('app/styles/main.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded'
        }))
        .on('error', $.notify.onError({
            title: 'SASS Failed',
            message: 'Error(s) occurred during compile!'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'Styles task complete'
        }));
});


// minify CSS
gulp.task('minify-css', function() {
    gulp.src(['app/styles/**/*.css', '!app/styles/**/*.min.css'])
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss({keepBreaks:true}))
        .pipe(gulp.dest('app/styles/'))
        .pipe(gulp.dest('app/_build/css/'));
});

gulp.task('default', ['browser-sync', 'sass', 'minify-css'], function() {
    gulp.watch('styles/*.css', function(file) {
        if (file.type === "changed") {
            reload(file.path);
        }
    });
    gulp.watch(['*.html', 'views/*.html'], {cwd: 'app'}, reload);
    gulp.watch(['*.js', 'scripts/controllers/*.js','scripts/services/*.js'], {cwd: 'app'}, reload);
    gulp.watch(['app/styles/*.scss','app/styles/**/*.scss'], ['sass', 'minify-css'],reload);
});

// delete build folder
gulp.task('clean:build', function (cb) {
    del([
        './app/_build/'
        // if we don't want to clean any file we can use negate pattern
        //'!dist/mobile/deploy.json'
    ], cb);
});

// SASS Build task
gulp.task('sass:build', function() {
    var s = $.size();

    return gulp.src('app/styles/main.scss')
        .pipe($.sass({
            style: 'compact'
        }))
        .pipe($.autoprefixer('last 3 version'))
        /*.pipe($.uncss({
            html: ['app/index.html', 'app/views/!*.html'],
            ignore: [
                '.index',
                '.slick'
            ]
        }))*/

        .pipe($.minifyCss({
            keepBreaks: true,
            aggressiveMerging: false,
            advanced: false
        }))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('app/_build/css'))
        .pipe(s)
        .pipe($.notify({
            onLast: true,
            message: function() {
                return 'Total CSS size ' + s.prettySize;
            }
        }));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
    return gulp.src([
        './app/views/*.html',
        '!app/libs/**/*.*',
        '!node_modules/**/*.*',
        '!_build/**/*.*'
    ])
        .pipe($.minifyHtml())
        .pipe($.angularTemplatecache({
            module: 'Monorythm'
        }))
        .pipe(gulp.dest('app/_build/js'));
});


/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
gulp.task('build', function(callback) {
    runSequence(
        /*'clean:build',*/
        'sass:build',
        /*'templates',*/
        'usemin',
        callback);
});

// index.html build
// script/css concatenation
gulp.task('usemin', function() {
    return gulp.src('./app/index.html')
    // add templates path
        .pipe($.htmlReplace({
            'templates': '<script type="text/javascript" src="js/templates.js"></script>'
        }))
        .pipe($.usemin({
            css: [$.minifyCss(), 'concat'],
            libs: [$.uglify()],
            appcomponents: [$.uglify()],

            /*
            nonangularlibs: [$.uglify()],
            angularlibs: [$.uglify()],
            appcomponents: [$.uglify()],
            mainapp: [$.uglify()]*/
        }))
        .pipe(gulp.dest('./app/_build/'));
});

/*
gulp.task('build', function(callback) {
    runSequence(
        'clean:build',
        'sass:build',
        //'images',
        'templates',
        // 'usemin',
        // 'fonts',
        // 'build:size',
        callback);
});*/
