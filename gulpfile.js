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
    var a = gulp.src('src/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'));

    var f = gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'));

    var b = gulp.src('dist/browser/assets')
        .pipe(clean());

    var s = gulp.src('dist/server/assets')
        .pipe(clean());

    return es.concat(a, f, b, s);
});

gulp.task('clean', function () {
    console.log('Limpando a pasta dist');
    var stream = gulp.src('dist')
        .pipe(clean());
    return stream;
});