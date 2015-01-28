var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');

var buildDir = './build';
var demoDir = './demo';

module.exports = function(gulp) {

	gulp.task('build', ['build-js', 'build-html', 'build-data']);

	gulp.task('build-js', function() {
		return gulp.src('./demo/main.js')
			.pipe(browserify({
			}))
			//.pipe(uglify())
			.pipe(rename('bundle.js'))
			.pipe(gulp.dest(buildDir));
	});

	gulp.task('build-html', function() {
		return gulp.src('demo/index.html')
			.pipe(gulp.dest(buildDir));
	});

	gulp.task('build-data', function() {
		return gulp.src(path.join(demoDir, 'data', '**'))
			.pipe(gulp.dest(path.join(buildDir, 'data')));
	});

	gulp.task('watch', function() {
		gulp.watch(['demo/**/*', 'index.js', 'src/**/*'], ['build']);
	});

	gulp.task('default', ['build', 'watch']);

};

