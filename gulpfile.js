var gulp = require("gulp");
var mocha = require("gulp-mocha");
var babel = require("gulp-babel");
var rename = require("gulp-rename");

var src = 'index.js'
var dest = './'
var out = 'slide-tutorial.js'

gulp.task('babel', function() {
    return gulp.src(src)
        .pipe(babel({presets: ['es2015']}))
        .pipe(rename(out))
        .pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
  gulp.watch(src, ['babel']);
});
