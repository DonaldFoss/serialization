var gulp = require('gulp');

var clean = require('gulp-rimraf');
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

gulp.task('build', ['amd', 'cjs']);

gulp.task('amd', function () {
    return gulp.src('lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('amd'));
});

gulp.task('cjs', function () {
    return gulp.src('lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(nodefy())
        .pipe(gulp.dest('cjs'));
});
