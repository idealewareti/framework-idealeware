var gulp = require('gulp');
    imagemin = require('gulp-imagemin');
    clean = require('gulp-clean');
    concat = require('gulp-concat');
    htmlReplce = require('gulp-html-replace');
    uglify = require('gulp-uglify');
    usemin = require('gulp-usemin');
    cssmin = require('gulp-cssmin');

var buildPath = './publish'    

gulp.task('copy', ['clean'], function(){
    console.log('Copiando arquivos...');
    return gulp.src('src/**/*')
        .pipe(gulp.dest(buildPath));
});

gulp.task('clean', function(){
    console.log('Limpando a pasta dist');
    var stream = gulp.src(buildPath)
        .pipe(clean());
    return stream;
});