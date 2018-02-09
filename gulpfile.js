var gulp = require('gulp');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var es = require('event-stream');

gulp.task('default', function () {
    console.log('Executando as operações pós build');
    gulp.start('build-img');
});

gulp.task('build-img', function () {
    console.log('Otimizando as imagens...');
    var b = gulp.src('src/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/browser/assets/images'));

    var s = gulp.src('src/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/server/assets/images'));

    return es.concat(b, s);
});


gulp.task('clean', function () {
    console.log('Limpando a pasta dist');
    var stream = gulp.src('dist')
        .pipe(clean());
    return stream;
});