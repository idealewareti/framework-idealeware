const gulp = require('gulp');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
var google_domain_properties = 'googleee84251d1ea736a6';

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

gulp.task('copy-google-ownership', function () {
    gulp.src('src/'+ google_domain_properties +'.html')
        .pipe(gulp.dest('dist/browser'));
})