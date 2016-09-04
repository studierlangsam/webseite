const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const rmrf = require('rimraf');
const sourcemaps = require('gulp-sourcemaps');

const builddir = 'build';
const stylesheets = 'style/**/*.scss';
const contentsources = 'content/**/*.pug';
const imagefiles = ['graphic/**/*', 'images/**/*'];

/**
 * Render the stylesheets.
 */
function style() {
	return gulp.src(stylesheets)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(`${builddir}/style`));
}

/**
 * Render the content pages.
 */
function content() {
	return gulp.src(contentsources)
		.pipe(pug({
			data: {
				require: require
			}
		}))
		.pipe(htmlmin({
			minifyJS: true,
			minifyCSS: true,
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			removeComments: true,
			useShortDoctype: true,
			sortAttributes: true,
			sortClassName: true
		}))
		.pipe(rename(path => {
			if (path.basename !== 'index') {
				path.dirname += '/' + path.basename;
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest(builddir));
}

/**
 * Copies images to the build dir.
 */
function images() {
	return gulp.src(imagefiles, {base: '.'})
		.pipe(gulp.dest(builddir));
}

/**
 * Reloads browsersync
 */
function reload(done) {
	browserSync.reload();
	done();
}

/**
 * Renders the stylesheets and reloads browsersync afterwards.
 */
function stylesheetReload() {
	return style().pipe(browserSync.stream());
}

/**
 * Watch file for changes and server the website through a local server.
 */
function watch() {
	browserSync.init({
		server: {
			baseDir: builddir
		},
		open: false
	});

	gulp.watch(stylesheets, stylesheetReload);
	gulp.watch([contentsources, 'layout'], gulp.series(content, reload));
	gulp.watch(imagefiles, gulp.series(images, reload));
}

/**
 * Cleans all build files.
 */
function clean(done) {
	rmrf(builddir, done);
}

gulp.task('clean', clean);
gulp.task('build', gulp.parallel(style, content, images));
gulp.task('watch', gulp.series('clean', 'build', watch));
