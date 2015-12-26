'use strict'

// requirements

var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    size = require('gulp-size'),
    concat = require('gulp-concat'),
    reactify = require('reactify'),
    clean = require('gulp-clean');




gulp.task('transform', function() {
    gulp.src('./cfs/static/assets/jsx/main.jsx')
        .pipe(browserify ( { transform: 'reactify', debug:true}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./cfs/static/assets/js/'));
});

gulp.task('watch', function () {
    gulp.watch('./cfs/static/assets/jsx/*', ['transform']);
});

gulp.task('clean', function() {
    return gulp.src('./cfs/static/assets/js/main.js', {read: false})
        .pipe(clean());
});

gulp.task('default', ['transform' ]);
