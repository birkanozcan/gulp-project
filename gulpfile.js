var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
var minify = require("gulp-minify");

var reload = browserSync.reload;

var htmlSrc = "./src/*.html";
var styleSrc = "./src/sass/*.scss";
var jsSrc = "./src/js/*.js";
var imgSrc = "./src/img/**";

var htmlDest = "./dist/";
var styleDest = "./dist/css/";
var jsDest = "./dist/js/";
var imgDest = "./dist/img/";

function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  return gulp
    .src(styleSrc)
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed"
      })
    )
    .pipe(autoprefixer('last 2 versions'))
    .on("error", console.error.bind(console))
    .pipe(gulp.dest(styleDest))
    .pipe(browserSync.stream());
  done();
}

function html(done) {
  return gulp
  .src(htmlSrc)
  .pipe(gulp.dest(htmlDest))
  done();
}

function js(done) {
  return gulp
    .src(jsSrc)
    .pipe(minify())
    .pipe(gulp.dest(jsDest))

  done();
}

function img() {
  return gulp
    .src(imgSrc)
    .pipe(gulp.dest(imgDest))
  done();
}

function watch_files() {
  gulp.watch(styleSrc).on("change", gulp.series(css, reload));
  gulp.watch(htmlSrc).on("change", gulp.series(html, reload));
  gulp.watch(jsSrc).on("change", gulp.series(js, reload));
  gulp.watch(imgSrc).on("change", gulp.series(img, reload));
}

gulp.task("css", css);
gulp.task("html", html);
gulp.task("js", js);
gulp.task("img", img);

// Default task: watch and build
gulp.task("default", gulp.parallel(css, html, js, img, browser_sync, watch_files));

// Build project to dist/
gulp.task("build", gulp.series(css, html, js , img));
