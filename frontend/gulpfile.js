const autoprefix = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const module_imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const module_pug = require('gulp-pug');
const rename = require('gulp-rename');
const module_sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const debug = require('gulp-debug');
const module_watch = require('gulp-watch');
const module_purgecss = require('gulp-purgecss');

const PORT = 3000;
const VERSION = '3.2.5';
const SRC = {
    root: 'src',
    pug: '/pug',
    pugwatch: '',
    css: '/sass',
    js: '/js',
    img: '/images',
    private: '/private',
    building: false
};

const DIST = {
    clean: ['dist'],
    root: 'dist',
    pug: '',
    css: '/assets/css',
    js: '/assets/js',
    img: '/images',
    assets: '/assets'
};

// Clear all
const clean = function() {
    return del(DIST.clean);
};
const browser_sync = function() {
    return browserSync.init({
        server: {
            baseDir: './dist',
            serveStaticOptions: { extensions: ['html'] }
        },
        startPath: SRC.pugwatch,
        port: PORT,
        notify: false,
        timestamps: true,
        files: [
            // DIST.root + SRC.pugwatch + "/**/*.html",
            DIST.root + DIST.css + '/*.css',
            '!' + DIST.root + DIST.css + '/*.min.css',
            DIST.root + DIST.js + '/*.js'
        ]
    });
};
const pug = function(obj) {
    const listDefault = [SRC.root + SRC.pug + SRC.pugwatch + '/**/*.pug', '!' + SRC.root + SRC.pug + '/**/_*.pug', '!' + SRC.root + SRC.pug + '/build/**/*.pug', '!' + SRC.root + SRC.pug + '/components/**/*.pug', '!' + SRC.root + SRC.pug + '/layouts/**/*.pug'];
    if (process.env.npm_lifecycle_event != 'start:doc') listDefault.push('!' + SRC.root + SRC.pug + '/docs/**/*.pug');

    return gulp
        .src(obj !== undefined && obj.path !== undefined ? obj.path : listDefault, { base: SRC.root + SRC.pug + SRC.pugwatch, allowEmpty: true })
        .pipe(
            plumber({
                errorHandler: function(err) {
                    // eslint-disable-next-line no-console
                    console.log(err);
                }
            })
        )
        .pipe(debug({ title: '[HTML] ', showCount: SRC.building, showFiles: true }))
        .pipe(module_pug({ pretty: '    ' }))
        .pipe(gulp.dest(DIST.root + DIST.pug + SRC.pugwatch))
        .on('end', () => browserSync.reload());
};
const sass = function() {
    return (
        gulp
            .src([SRC.root + SRC.css + '/*.scss', '!' + SRC.root + SRC.css + '/_*.scss'])
            .pipe(sourcemaps.init())
            .pipe(debug({ title: '[CSS]  ', showCount: SRC.building, showFiles: true }))
            .pipe(module_sass().on('error', module_sass.logError))
            .pipe(autoprefix())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(DIST.root + DIST.css))
            .pipe(cleanCSS())
            // .pipe(concat(PATH.scss+"/"))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(DIST.root + DIST.css))
    );
};
const purgecss = function() {
    const home_file = gulp
        .src(DIST.root + DIST.css + '/styles_homepage.min.css')
        .pipe(module_purgecss({ content: [DIST.root + '/index.html', DIST.root + DIST.js + '/main.js', DIST.root + DIST.js + '/library_homepage.js'], rejected: false, whitelistPatterns: [/tooltip/] }))
        .pipe(gulp.dest(DIST.root + DIST.css));
    const page_file = gulp
        .src(DIST.root + DIST.css + '/styles.min.css')
        .pipe(module_purgecss({ content: [DIST.root + '/**/*.html', '!' + DIST.root + '/index.html', DIST.root + DIST.js + '/pages.js', DIST.root + DIST.js + '/library.js'], rejected: false, whitelistPatterns: [/tooltip/] }))
        .pipe(gulp.dest(DIST.root + DIST.css));
    return merge(home_file, page_file);
};
const scripts_library = function() {
    const main_file = gulp
        .src([
            SRC.root + SRC.js + '/library/jquery-3.3.1.min.js',
            SRC.root + SRC.js + '/library/imagesloaded.min.js',
            // SRC.root + SRC.js + "/library/moment.min.js",
            // SRC.root + SRC.js + "/library/popper.min.js",
            SRC.root + SRC.js + '/library/*.main.min.js'
        ])
        // .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(debug({ title: '[MLJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(
            uglify().on('error', function(e) {
                // eslint-disable-next-line no-console
                console.log(e);
            })
        )
        .pipe(concat('library.js'))
        .pipe(gulp.dest(DIST.root + DIST.js));

    const home_file = gulp
        .src([
            SRC.root + SRC.js + '/library/jquery-3.3.1.min.js',
            SRC.root + SRC.js + '/library/imagesloaded.min.js',
            // SRC.root + SRC.js + "/library/moment.min.js",
            // SRC.root + SRC.js + "/library/popper.min.js",
            SRC.root + SRC.js + '/library/*.home.main.min.js'
        ])
        // .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(debug({ title: '[HLJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(
            uglify().on('error', function(e) {
                // eslint-disable-next-line no-console
                console.log(e);
            })
        )
        .pipe(concat('library_homepage.js'))
        .pipe(gulp.dest(DIST.root + DIST.js));
    return merge(main_file, home_file);
};

const scripts_main = function() {
    const main_file = gulp
        .src([SRC.root + SRC.js + '/common.js', SRC.root + SRC.js + '/pages.js', SRC.root + SRC.js + '/*.js', '!' + SRC.root + SRC.js + '/main.js'])
        .pipe(debug({ title: '[MPJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(concat('pages.js'))
        .pipe(gulp.dest(DIST.root + DIST.js))
        .pipe(
            uglify().on('error', function(e) {
                // eslint-disable-next-line no-console
                console.log(e);
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST.root + DIST.js));
    const home_file = gulp
        .src([SRC.root + SRC.js + '/common.js', SRC.root + SRC.js + '/main.js'])
        .pipe(debug({ title: '[MHJS] ', showCount: SRC.building, showFiles: true }))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(DIST.root + DIST.js))
        .pipe(
            uglify().on('error', function(e) {
                // eslint-disable-next-line no-console
                console.log(e);
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DIST.root + DIST.js));
    return merge(main_file, home_file);
};

const copyfile = function(obj) {
    const listDefault = [SRC.root + SRC.private + '/manifest.json', SRC.root + SRC.private + '/**/**.*'];
    const private_file = gulp
        .src(obj !== undefined && obj.path !== undefined ? obj.path : listDefault, { base: SRC.root + SRC.private, allowEmpty: true })
        .pipe(debug({ title: '[PFILE]', showCount: SRC.building, showFiles: true }))
        .pipe(gulp.dest(DIST.root + DIST.assets))
        .on('end', () => browserSync.reload());
    const build_data_file = gulp
        .src(SRC.root + SRC.pug + '/build/data/**/**.*')
        .pipe(debug({ title: '[BFILE]', showCount: SRC.building, showFiles: true }))
        .pipe(gulp.dest(DIST.root + DIST.assets + '/build/data'))
        .on('end', () => browserSync.reload());
    return merge(private_file, build_data_file);
};

const imagemin = function(obj) {
    const listDefault = [SRC.root + SRC.img + '/**/**.*'];
    return gulp
        .src(obj !== undefined && obj.path !== undefined ? obj.path : listDefault, { base: SRC.root + SRC.img, allowEmpty: true })
        .pipe(debug({ title: '[IMG]  ', showCount: SRC.building, showFiles: true }))
        .pipe(module_imagemin())
        .pipe(gulp.dest(DIST.root + DIST.img))
        .on('end', () => browserSync.reload());
};

// var _reload = function (done) {
//     browserSync.reload();
//     return done();
// }

const watch = function() {
    module_watch([SRC.root + SRC.pug + SRC.pugwatch + '/**/*.pug', SRC.root + SRC.pug + '/components/**/*.pug', SRC.root + SRC.pug + '/layouts/**/*.pug'], obj => (obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? pug() : pug(obj)));
    module_watch([SRC.root + SRC.css + '/**/*.scss'], sass);
    module_watch([SRC.root + SRC.js + '/library/*.min.js'], scripts_library);
    module_watch([SRC.root + SRC.js + '/*.js'], scripts_main);
    // Bonus image & copy file
    module_watch([SRC.root + SRC.img + '/**/*.*'], obj => (obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? imagemin() : imagemin(obj)));
    module_watch([SRC.root + SRC.private], obj => (obj.path.match(/[-_\w]+[.][\w]+$/i)[0].indexOf('_') == 0 ? copyfile() : copyfile(obj)));
    // eslint-disable-next-line no-console
    console.log('\x1b[31m\x1b[1m\n================== \t COREFE: ' + VERSION + ' / START PORT: ' + PORT + ' \t ================== \n\x1b[0m');
};

const build = function() {
    SRC.pugwatch = '';
    SRC.building = true;
    return del(DIST.clean);
};

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.sass = sass;
exports.pug = pug;
exports.scripts_library = scripts_library;
exports.scripts_main = scripts_main;
exports.copyfile = copyfile;
exports.imagemin = imagemin;
exports.purgecss = purgecss;

/*
 * Return the task when a file changes
 */
exports.watch = gulp.series(clean, gulp.parallel(sass, scripts_library, scripts_main, pug), purgecss, gulp.parallel(gulp.parallel(browser_sync, watch), gulp.parallel(copyfile, imagemin)));

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = gulp.series(
    build,
    // gulp.parallel([pug, sass, scripts_library, scripts_main, copyfile, imagemin])
    gulp.parallel([sass, scripts_library, scripts_main, pug]),
    purgecss,
    gulp.parallel([copyfile, imagemin])
);
