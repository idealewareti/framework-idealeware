const gulp = require('gulp');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');

gulp.task('clean', function () {
    var stream = gulp.src('dist')
        .pipe(clean());
    return stream;
});

gulp.task('images', () =>
    gulp.src('src/assets/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/browser/assets/images/'))
);