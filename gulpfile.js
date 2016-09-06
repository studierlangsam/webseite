const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const rmrf = require('rimraf');
const sourcemaps = require('gulp-sourcemaps');
const rsync = require('gulp-rsync');
const w3cjs = require('gulp-w3cjs');
const scsslint = require('gulp-scss-lint');

const builddir = 'build';
const stylesheets = 'style/**/*.scss';
const contentsources = 'content/**/*.pug';
const imagefiles = ['graphic/**/*', 'images/**/*', 'favicon.ico'];

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
			minifyJS: {
				mangle: true,
				compress: {
					sequences: true,
					dead_code: true,
					conditionals: true,
					booleans: true,
					unused: true,
					if_return: true,
					join_vars: true,
					drop_console: true
				}
			},
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

/**
 * Validates the rendered HTML.
 */
function checkHTML() {
	return gulp.src(`${builddir}/**/*.html`)
		.pipe(w3cjs({
			charset: 'utf-8'
		}))
		.pipe(w3cjs.reporter());
}

/**
 * Lints the stylesheets.
 */
function checkStyle() {
	return gulp.src('style/**/*.scss')
		.pipe(scsslint())
		.pipe(scsslint.failReporter());
}

/**
 * Uploads the built files to the webserver.
 */
function upload() {
	return gulp.src(`${builddir}/**`)
		.pipe(rsync({
			root: 'build',
			hostname: 'studierlangsam@studierlangsam.de',
			destination: '/var/www/studierlangsam',
			archive: true,
			progress: true,
			clean: true
		}));
}

gulp.task('clean', clean);
gulp.task('build', gulp.parallel(style, content, images));
gulp.task('watch', gulp.series('clean', 'build', watch));
gulp.task('check', gulp.series('clean', 'build', gulp.parallel(checkHTML, checkStyle)));
gulp.task('deploy', gulp.series('clean', 'build', upload));
