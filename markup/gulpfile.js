var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var cssbeautify = require('gulp-cssbeautify');
var runSequence = require('run-sequence');

// styles task
gulp.task('sass', function () {
	return gulp.src('./scss/**/*.scss')
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass.sync().on('error', sass.logError))
	.pipe(
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.stream());
});

// Static server
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch('js/*.js').on('change', browserSync.reload);
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('sourceimages/*', ['imagemin']);
	gulp.watch("*.html").on('change', browserSync.reload);
});

// imagemin
gulp.task('imagemin', function() {
	gulp.src('sourceimages/*')
	.pipe(plumber())
	.pipe(imagemin())
	.pipe(gulp.dest('images'));
})

// clean css and images
gulp.task('clean', function() {
	return gulp.src(['css', 'images'], {read: false})
	.pipe(clean());
});

gulp.task('clean:maps', function() {
	return gulp.src('css/main.css.map')
	.pipe(clean({
		force: true
	}));
});

// task beautify
gulp.task('beautify', function() {
	gulp.src('css/*.css')
	.pipe(cssbeautify({
		indent_size: 2,
	}))
	.pipe(plumber())
	.pipe(gulp.dest('./css/'));
});

// task dist
// release project and make ready for QA
gulp.task('dist', function(callback) {
	runSequence('clean', 'sass', 'imagemin', 'beautify', 'clean:maps', callback);
});

gulp.task('default', ['browser-sync']);