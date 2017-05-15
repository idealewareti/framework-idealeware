var gulp = require('gulp'),
    useref = require('gulp-useref');
    clean = require('gulp-clean');
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css');
    rename = require('gulp-rename');

gulp.task('default', ['clean'], function(){
    console.log('Preparando publicação...');
    gulp.start(['app', 'system', 'dependencies']);
})

gulp.task('clean', function(){
    console.log('Limpando pasta de destino...');
    var stream = gulp.src('publish')
        .pipe(clean());
    return stream;
});

gulp.task('vendors', function(){
    console.log('Criando arquivos de vendors');
    var stream = gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('publish'));
    return stream;
});

gulp.task('app', ['views', 'styles', 'assets'], function(){
    console.log('Gerando publicação da aplicação...');

    gulp.src(['app/**/*', '!app/app.settings.js'])
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest('publish/app'));

    return gulp.src('app/app.settings.prod.js', { base: './' })
        .pipe(uglify())
        .pipe(rename('app.settings.js'))
        .pipe(gulp.dest('publish/app', {overwrite: true}));
});

gulp.task('system', ['vendors'], function(){
     return gulp.src('systemjs.config.prod.js', { base: './' })
        .pipe(uglify())
        .pipe(rename('system.js'))
        .pipe(gulp.dest('publish/scripts', {overwrite: true}));
})

gulp.task('views', function(){
    console.log('Gerando as views...');
    return gulp.src('views/**/*')
        .pipe(gulp.dest('publish/views'));
});

gulp.task('styles', function(){
    return gulp.src('styles/**/*')
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('publish/styles'));
});

gulp.task('assets', function(){
    console.log('Copiando fontes...');
    gulp.src('node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest('publish/fonts'));

    console.log('Copiando folhas de estilo...');
    gulp.src('assets/styles/**/*')
        .pipe(gulp.dest('publish/assets/styles'));

    console.log('Copiando favicon...');
    gulp.src('favicon.ico')
        .pipe(gulp.dest('publish'));

    console.log('Copiando imagens...');
    return gulp.src('assets/images/**/*')
        .pipe(gulp.dest('publish/assets/images'));
});

gulp.task('dependencies', function(){
    console.log('Obtendo bundles de dependências...')
    
    gulp.src('node_modules/rxjs/**/*')
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('publish/bundles/rxjs'));
    
    return gulp.src([
            'node_modules/@angular/core/bundles/core.umd.js',
            'node_modules/@angular/common/bundles/common.umd.js',
            'node_modules/@angular/compiler/bundles/compiler.umd.js',
            'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
            'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            'node_modules/@angular/http/bundles/http.umd.js',
            'node_modules/@angular/router/bundles/router.umd.js',
            'node_modules/@angular/forms/bundles/forms.umd.js',
            'node_modules/angular2-in-memory-web-api',
            'node_modules/ngx-progressbar/bundles/ngx-progressbar.umd.js'
        ])
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('publish/bundles/'));
});