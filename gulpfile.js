var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    console.log('Limpando a pasta dist');
    var stream = gulp.src('dist')
        .pipe(clean());
    return stream;
});