var gulp = require('gulp');
var _ = require('underscore');
var eslint = require('gulp-eslint');
var del = require('del');
var webpack = require('gulp-webpack');
var htmlreplace = require('gulp-html-replace');

var webpackDevConf = require('./webpack.config');
var webpackProdConf = require('./webpack.production.config');

gulp.task('eslint', function() {
    //ignore index.jsx cuz' or will introduce React not used error
    return gulp.src(['**/*.js', '!./dist/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', function(cb) {
    return console.log('test');
});

gulp.task('webpack-prod', function() {
    return gulp.src('src/app/index.jsx')
        .pipe(webpack(webpackProdConf))
        .pipe(gulp.dest('dist/'));
});
gulp.task('clean', function() {
    return del.sync(['./dist/**/*']);
});

gulp.task('html-prod', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'js': webpackProdConf.output.filename
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('html-dev', function() {
    var output = webpackDevConf.output;
    var baseUrl = webpackDevConf.entry[0].split('?')[1];
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'js': baseUrl + output.publicPath + output.filename
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-images', function() {
    return gulp.src('./src/images/**/*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['eslint', 'test']);

gulp.task('build', ['eslint', 'test', 'clean', 'webpack-prod', 'html-prod']);

gulp.task('dev', ['clean', 'html-dev']);
