var gulp = require('gulp');
var $ = require('gulp-load-plugins', {camelize: true})();

gulp.task('concat', function() {
    return gulp.src('wrappers/*.js')
        .pipe($.template({
            body: require('fs').readFileSync('traverser.js').toString()
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['concat']);
