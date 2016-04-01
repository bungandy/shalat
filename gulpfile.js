var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    compass     = require('gulp-compass'),
    cssnano     = require('gulp-cssnano'),
    concatJS    = require('gulp-concat'),
    clean       = require('gulp-clean'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    runSequence = require('run-sequence');

gulp.task('js', function(){
    gulp.src([
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angularjs-geolocation/src/geolocation.js',
            'bower_components/moment/moment.js',

            'src/js/app.js',

            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'bower_components/retina.js/src/retina.js'
        ])
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concatJS('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/assets'));

});

gulp.task('compass', function() {
    gulp.src('src/sass/*.scss')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(compass({
            image: 'app/assets/img',
            css: 'app/assets',
            sass: 'src/sass'
        }))
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(gulp.dest('app/assets'));
});

gulp.task('html', function() {
    gulp.src(['src/html/*.html'])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('clean-all', function(){
    return gulp.src([
        'app/*.html',
        'app/assets/style.css',
        'app/assets/script.js'], {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('watch',function(){
    browserSync.init({
        server: {
            baseDir: 'app',
            directory: true
        },
        browser: 'google chrome',
        notify: false
    });

    gulp.watch('src/js/*.js',['js']);

    gulp.watch(['src/sass/*.scss','src/sass/*/*.scss'],['compass']);

    gulp.watch(["src/html/*.html", "src/html/partials/*.html"], ['html']);

    gulp.watch([
        'app/*.html',
        'app/assets/*.js',
        'app/assets/*.css'
        ]).on('change', function() {
            browserSync.reload();
        });

});

gulp.task('clean', function() {
    runSequence('clean-all', ['js','compass','html'], function(){
        console.log('===============================[ wait a second ]===============================');
    });
});

gulp.task('build', function() {
    runSequence('compass', function(){
         gulp.src([
                'app/assets/script.js'
            ])
            .pipe(plumber())
            .pipe(uglify());

        gulp.src([
                'app/assets/app.js'
            ])
            .pipe(plumber())
            .pipe(uglify());
        console.log('===============================[ script, css are compressed ]===============================');
    });
});

gulp.task('default', ['clean'], function(){});

