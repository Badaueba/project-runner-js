var gulp = require('gulp');
/* Mixed */
var ext_replace = require('gulp-ext-replace');
var rename = require("gulp-rename")

/* SCSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');

/* CSS min */
var cleanCSS = require("gulp-clean-css");

/* JS & TS */
var jsuglify = require('gulp-uglify');

/* Images */
var imagemin = require('gulp-imagemin');

var appDev = 'dev/';
var appProd = 'build/';

gulp.task('build-css', function () {
    return gulp.src(appDev + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([precss, autoprefixer, cssnano]))
        .pipe(sourcemaps.write())
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest(appProd));
});

gulp.task("minify-css", function () {
    return gulp.src(appDev + "/**/*.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(appProd))
})

gulp.task('build-ts', function () {
    return gulp.src(appDev + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        //.pipe(jsuglify())
        .pipe(gulp.dest(appProd));
});

gulp.task('build-img', function () {
    return gulp.src(appDev + '/**/*.jpg')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(appProd));
});

gulp.task('build-html', function () {
    return gulp.src(appDev + '**/*.html')
        .pipe(gulp.dest(appProd));
});

gulp.task('watch', function () {
    // gulp.watch(appDev + 'scss/**/*.scss', ['build-css']);
    gulp.watch(appDev + "/**/*.css", ['minify-css']);
    gulp.watch(appDev + "/**/*.jpg", ['build-img']);

});

gulp.task('default', ['watch', 'build-css']);