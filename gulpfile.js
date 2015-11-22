/*jshint node: true, varstmt: false */
'use strict';

var gulp = require('gulp'),
    del = require('del'),
    exec = require('child_process').exec,
    fs = require('fs'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    proxyMiddleware = require('http-proxy-middleware'),
    htmlReplace = require('gulp-html-replace'),
    inlineSource = require('gulp-inline-source'),
    minifyHtml = require('gulp-minify-html'),
    Cachebust = require('gulp-cachebust'),
    cachebust = new Cachebust({ checksumLength: 16 }),
    gzip = require('gulp-gzip'),
    tar = require('gulp-tar'),
    touch = require('touch'),
    runSeq = require('run-sequence'),
    jspm = require('jspm'),
    package_json = require('./package.json'),
    main = 'app/main.js',
    srcDir = 'html',
    destDir = package_json.name;

gulp.task('serve', [ 'sass' ], function () {
    var proxyOptions = {
            target: 'http://localhost:9999'
        },
        ipinfoProxy = proxyMiddleware('/ipinfo', proxyOptions),
        foursquareProxy = proxyMiddleware('/foursquare-venues', proxyOptions);

    browserSync.init({
        server: {
            baseDir: srcDir,
            middleware: [ ipinfoProxy, foursquareProxy ]
        },
        open: false
    });

    // I wanted to use ES2015 and inuitcss, which require jspm and Sass
    // respectively. The problem is jspm and Sass integration seems to be a bit
    // of a grey area at the moment especially if you want to use jspm's self
    // executable bundle feature (SFX).
    //
    // So, what this watch is actually doing is watching for *.scss files and
    // when one is changed, sass is run which in turn changes the CSS file all
    // the Sass files compile to. The next watch below notices the css file has
    // changed and reloads the browser.
    //
    // This is a bit of a hack because it uses "exec" and makes quite a few
    // assumptions about the existence/location of files but it works.
    gulp.watch([
        srcDir + '/**/*.scss',
        '!' + srcDir + '/jspm_packages/**/*',
        '!' + srcDir + '/app/bower_components/**/*'
    ]).on('change', function () {
        exec(
            'node_modules/.bin/node-sass html/app/main.scss > html/app/main.css',
            function (err, stdout, stderr) {
                if (err) {
                    console.log(stderr);
                }
            }
        );
    });

    gulp.watch([
        srcDir + '/**/*.@(js|html|css|json)',
        '!' + srcDir + '/jspm_packages/**/*',
        '!' + srcDir + '/app/bower_components/**/*'
   ]).on('change', browserSync.reload);
});

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

gulp.task('sass', function () {
    return gulp.src(srcDir + '/app/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest(srcDir + '/app'));
});

gulp.task('img', function () {
    return gulp.src(srcDir + '/img/*.*')
        .pipe(gulp.dest(destDir + '/img/'));
});

gulp.task('gzip', function () {
    return gulp.src(destDir + '/*')
        .pipe(gzip({ level: 9 }))
        .pipe(gulp.dest(destDir));
});

gulp.task('tar', function () {
    return gulp.src('@(' + destDir + ')/**/*')
        .pipe(tar(destDir + '-' + package_json.version + '.tar'))
        .pipe(gulp.dest('./'));
});

gulp.task('touch', function (done) {
    var now = Date.now();

    fs.readdir(destDir, function (err, files) {
        if (err) {
            return done(err);
        }

        files.forEach(function (file) {
            touch.sync(destDir + '/' + file, { time: now });
        });
    });

    done();
});

gulp.task('default', function (done) {
    runSeq('clean', 'sass', 'bundleSFX', 'cache-bust-resources', 'html',
        'prune', 'gzip', 'touch', 'img', 'tar', done
    );
});
