var gulp = require('gulp');

var jshint = require('gulp-jshint');
var nodefy = require('gulp-nodefy');
var uglify_ = require('gulp-uglify');

var pretty = {
    mangle : false,
    output : { beautify : true },
    compress : false,
    preserveComments : 'all'
};
var optimal = {};
var uglify = function () { return uglify_(pretty); };

gulp.task('build', ['amd', 'cjs', 'manage']);

gulp.task('manage', ['bower', 'npm']);

gulp.task('bower', function () {
    return gulp.src('manage/bower.json')
        .pipe(gulp.dest('amd'));
});

gulp.task('npm', function () {
    return gulp.src('manage/package.json')
        .pipe(gulp.dest('node'));
});

gulp.task('amd', function () {
    return gulp.src('lib/**/*.js')
        .pipe(uglify())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('amd'));
});

gulp.task('cjs', function () {
    return gulp.src('lib/**/*.js')
        .pipe(uglify())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(nodefy())
        .pipe(gulp.dest('node'));
});
