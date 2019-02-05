var syntax = 'sass', // Syntax: sass or scss;
    gulpversion = '4'; // Gulp version: 3 or 4


var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    rsync = require('gulp-rsync');

var AUTOPREFIXER_BROWSERS = [
    'last 15 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false,
        open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectnames", // Demonstration page: http://projectnames.localtunnel.me
        ghostMode: true,
        https: false,
        watchOptions: {
            debounceDelay: 1500 // This introduces a small delay when watching for file change events to avoid triggering too many reloads
        }
        // uncomment below is you want specific browsers to be launched when you run the script.
        //browser: ['google chrome', 'firefox developer edition']
    });
    console.log('browserSync work!');
});

gulp.task('styles', function() {
    console.log('styles work!');
    return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
        // .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    console.log('scripts work!');
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/inputmask/dist/jquery.inputmask.bundle.js',
            'app/libs/owl.carousel/dist/owl.carousel.min.js',
            'app/libs/jquery-mmenu/source/jquery.mmenu.min.all.js',
            'app/js/data.js',
            'app/js/common.js' // Always at the end
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) // Mifify js (opt.)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));

});

gulp.task('code', function() {
    console.log('code work!');
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('rsync', function() {
    console.log('rsync work!');
    return gulp.src('app/**')
        .pipe(rsync({
            root: 'app/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // include: ['*.htaccess'], // Includes files to deploy
            exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }));
});

if (gulpversion == 3) {
    gulp.task('watch', ['browser-sync'], function() {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles']);
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
        gulp.watch('app/*.html', ['code']);
    });
    gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
    gulp.task('watch', function() {
        gulp.watch('app/' + syntax + '/**/*.' + syntax + '', gulp.parallel('styles'));
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
        gulp.watch('app/*.html', gulp.parallel('code'));
    });
    gulp.task('default', gulp.parallel('watch', 'browser-sync'));
    console.log('default work!');
}