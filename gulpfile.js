var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('concatTs', function() {
    // place code for your default task here
    gulp.src('./src/**/*.ts')
        .pipe(concat('index.ts'))
        // .pipe(uglify())
        .pipe(gulp.dest('./temp/'));
});

gulp.task('compressJs', function() {
    // place code for your default task here
    gulp.src('./dist/index.js')
        .pipe(concat('index1.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});