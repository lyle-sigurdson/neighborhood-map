/*jshint node: true, varstmt: false */
'use strict';

var gulp = require('gulp'),
    del = require('del'),
    htmlReplace = require('gulp-html-replace'),
    inlineSource = require('gulp-inline-source'),
    minifyHtml = require('gulp-minify-html'),
    Cachebust = require('gulp-cachebust'),
    cachebust = new Cachebust({ checksumLength: 16 }),
    runSeq = require('run-sequence'),
    jspm = require('jspm'),
    main = 'app/main.js',
    srcDir = 'html',
    destDir = 'dest';

gulp.task('clean', function () {
    return del(destDir);
});

gulp.task('prune', function() {
    return del(destDir + '/index.js');
});

gulp.task('cache-bust-resources', function() {
    return gulp.src(destDir + '/index.js')
        .pipe(cachebust.resources())
        .pipe(gulp.dest(destDir));
});

gulp.task('bundleSFX', function () {
    return jspm.bundleSFX(
        main, destDir + '/index.js', { sourceMaps: true, minify: true }
    );
});

gulp.task('html', function () {
    return gulp.src(srcDir + '/index.html')
        .pipe(htmlReplace({ js: 'index.js' }))
        .pipe(inlineSource())
        .pipe(cachebust.references())
        .pipe(minifyHtml())
        .pipe(gulp.dest(destDir));
});

gulp.task('default', function (done) {
    runSeq('clean', 'bundleSFX', 'cache-bust-resources', 'html', 'prune', done);
});
