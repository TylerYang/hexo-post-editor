var gulp = require('gulp');
var _ = require('underscore');
var eslint = require('gulp-eslint');
var del = require('del');
var webpack = require('gulp-webpack');
var htmlreplace = require('gulp-html-replace');
var less =require('gulp-less');
var concat = require('gulp-concat');

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

//Tyler: don't need watch task cuz' dynamic gen styles
//       means it should be combinded to react component(webpack loader);
gulp.task('convert-less', function() {
    return gulp.src(['./src/less/font-awesome/font-awesome.less'])
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/'));
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
    return gulp.src(['./src/images/*',])
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('copy-fonts', function() {
    return gulp.src(['./src/fonts/*',])
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('copy-static', ['copy-images', 'copy-fonts']);

gulp.task('default', ['eslint', 'test']);

gulp.task('build', ['convert-less', 'eslint', 'test', 'clean', 'webpack-prod', 'html-prod', 'copy-static']);

gulp.task('dev', ['clean', 'convert-less', 'html-dev', 'copy-static']);
