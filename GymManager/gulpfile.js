"use strict";

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    cleancss = require("gulp-clean-css"),
    uglify = require("gulp-uglify"),
    watch = require("gulp-watch"),
    order = require("gulp-order"),
    del = require("del"),
    run = require("gulp-run");


var paths = {
    webroot: "./wwwroot/",
    dist: "./wwwroot/dist/"
};

var sources = {
    webpackConfig: "./webpack.config.vendor.js",
    sass: "./ClientApp/app/**/*.scss",
    globalCss: "./ClientApp/app/styles/**/*.css",
    globalSass: "./ClientApp/app/styles/**/*.scss",
}

var dest = {
    css: paths.dist + "app.min.css",
    admin: {
        css: paths.webroot + "css/admin.min.css",
        js: paths.webroot + "js/admin.min.js"
    }
};


gulp.task("clean:css", function () {
    return del([dest.css, dest.admin.css]);
});
gulp.task("clean:js", function () {
    return del(dest.admin.js);
});
gulp.task("clean", gulp.parallel("clean:css", "clean:js"));

//gulp.task("min:js", function () {
//    gulp.src([paths.js, "!" + paths.minJs, paths.siteJs, paths.scripts, "!" + paths.libs], { base: "." })
//        .pipe(order([
//            paths.siteJs,
//            paths.scripts
//        ]))
//        .pipe(concat(paths.concatJsDest))
//        .pipe(uglify())
//        .pipe(gulp.dest("."));
//});

gulp.task("sass", gulp.series("clean", function () {
    return gulp.src(sources.sass)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        .on("error", gutil.log);
}));

gulp.task("min:css", gulp.series("sass", function () {
    return gulp.src(sources.globalCss)
        .pipe(concat(dest.css))
        .pipe(cleancss({ compatibility: "ie8" }))
        .pipe(gulp.dest("."));
}));
gulp.task("min", gulp.series("min:css"));

gulp.task("webpack", function () {
    return run("node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.ts").exec()
        //.pipe(gulp.dest("output"))
        .on("error", gutil.log);
});

gulp.task("webpack-prod", function () {
    return run("node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.ts --env.prod").exec()
        //.pipe(gulp.dest("output"))
        .on("error", gutil.log);
});

gulp.task("watch", function () {
    gulp.watch([sources.webpackConfig, sources.css, sources.sass], ["dist"]);
});

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md
gulp.task("dist", gulp.series("clean", "webpack", "min"));