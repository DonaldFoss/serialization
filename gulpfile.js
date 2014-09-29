var gulp = require('gulp');

var jshint = require('gulp-jshint');
var nodefy = require('gulp-nodefy');
var preprocess = require('gulp-preprocess');
var uglify_ = require('gulp-uglify');

var browser = { context : {
    TARGET_ENV : 'browser'
}};

var node = { context : {
    TARGET_ENV : 'node'
}};

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
        .pipe(preprocess(browser))
        .pipe(uglify())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('amd'));
});

gulp.task('cjs', function () {
    return gulp.src('lib/**/*.js')
        .pipe(preprocess(node))
        .pipe(uglify())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(nodefy())
        .pipe(gulp.dest('node'));
});
