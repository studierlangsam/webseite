import gulp from "gulp";
import {create as createBrowserSync} from "browser-sync";
import gulp_sass from "gulp-sass";
import plainSass from "sass";
import pug from "gulp-pug";
import rename from "gulp-rename";
import htmlmin from "gulp-htmlmin";
import {rimraf as rmrf} from "rimraf";
import sourcemaps from "gulp-sourcemaps";
import w3cjs from "gulp-w3cjs";
import stylelint from "@ronilaukkarinen/gulp-stylelint";
import cleanCss from "gulp-clean-css";
import parallel from "concurrent-transform";
import revall from "gulp-rev-all";
import clean from "gulp-clean";
import read from "gulp-read";
import gIf from "gulp-if";
import plumber from "gulp-plumber";
import os from "os";
import plainresize from "gulp-image-resize";
import gulpRunCommand from "gulp-run-command";
import git from "gulp-git";
import * as fs from "fs";
import emojione from "emojione"

const browserSync = createBrowserSync();
const run = gulpRunCommand.default

// load the sass compiler in node 16
const sass = gulp_sass(plainSass);
const resize = options => parallel(plainresize(options), os.cpus().length);
// whether we are building a release version, as opposed to a development build.
let release = false;
let releaseversion = null;
// the built page will be put into this directory for development builds.
let builddir = 'build';
// the built page will be put into this directory for release builds.
const releasedir = 'release';
const stylesheets = 'style/**/*.scss';
const scripts = 'script/**/*.js';
const miscstaticfiles = 'static/**/*';
const pages = 'pages/**/*.pug';
const contentfiles = 'content/**/*';
const graphicfiles = ['graphic/**/*', 'favicon.ico'];
const tutorenfiles = 'images/tutoren/*.jpg';

/**
 * Render the stylesheets.
 */
function style() {
	return gulp.src(stylesheets)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(gIf(release, cleanCss({
			shorthandCompacting: true
		})))
		.pipe(gIf(!release, sourcemaps.write('.')))
		.pipe(gulp.dest(`${builddir}/style`));
}

/**
 * Render the content pages.
 */
function content() {
	return gulp.src(pages)
		.pipe(plumber())
		.pipe(pug({
			data: { emojione, fs }
		}))
		.pipe(plumber.stop())
		.pipe(gIf(release, htmlmin({
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
		})))
		.pipe(rename(path => {
			if (path.basename !== 'index') {
				path.dirname += '/' + path.basename;
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest(builddir));
}

/**
 * Copies static images to the build dir.
 */
function graphics() {
	return gulp.src(graphicfiles, {base: '.'})
		.pipe(gulp.dest(builddir));
}

/**
 * Copies miscelangelous static files to the build dir.
 */
function miscstatic() {
	return gulp.src(miscstaticfiles)
		.pipe(gulp.dest(builddir));
}

/**
 * Copies an resizes images to the build dir.
 */
function images() {
	return gulp.src(tutorenfiles, {base: '.'})
		.pipe(resize({
			width: Math.floor(0.4 * 16 * 36), // 40% * font size * layout breakpoint, see tutoren.scss
			quality: 0.9,
			filter: 'Catrom'
		}))
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
 * Watch file for changes and trigger the according tasks
 */
function watch() {
	gulp.watch(stylesheets, stylesheetReload);
	gulp.watch([pages, 'layout', scripts], gulp.series(content, reload));
	gulp.watch(graphicfiles, gulp.series(graphics, reload));
	gulp.watch(tutorenfiles, gulp.series(images, reload));
	gulp.watch(contentfiles, gulp.series(content, reload))
}

/**
 * Serves the build directory through a local web server.
 */
function serve() {
	browserSync.init({
		server: {
			baseDir: builddir
		},
		open: false
	});
}

/**
 * Cleans all build files.
 */
function cleanbuilddir() {
	return rmrf(builddir);
}

/**
 * Validates the rendered HTML.
 */
function checkHTML() {
	return gulp.src([`${builddir}/**/*.html`, `!${builddir}/google*.html`, `!${builddir}/wochenplan/wochenplan.ics`])
		.pipe(w3cjs({
			charset: 'utf-8'
		}))
		.pipe(w3cjs.reporter());
}

/**
 * Lints the stylesheets.
 */
gulp.task('checkStyle', () =>
	gulp.src('style/**/*.scss')
		.pipe(stylelint({
			reporters: [{
				formatter: 'string',
				console: true
			}]
		}))
)

/**
 * Fixes the stylesheets.
 */
gulp.task('fixStyle', () =>
	gulp.src('style/**/*.scss')
		.pipe(stylelint({
			fix: true
		}))
		.pipe(gulp.dest('style'))
)

/**
 * Adds revision hashes to assets and adapts links to them.
 */
function revision() {
	// only revision some files.
	return gulp.src([
		`${builddir}/{graphic,script,style}/**/*.{css,jpg,png,svg,html,ico,js,ttf,otf,eot}`,
		`${builddir}/**/*.html`
	])
		.pipe(read())
		.pipe(clean())
		.pipe(revall.revision({
			dontRenameFile: [
				/^\/favicon.ico$/g, // must be called that way to be detected
				'.html' // must rename their name on the web server
			],
			dontGlobal: [/^\/google.*.html$/],
			hashLength: 6
		}))
		.pipe(gulp.dest(builddir));
}

/**
 * Changes the build directory to the release directory.
 */
function setreleasemode(done) {
	builddir = releasedir;
	release = true;
	done();
}

function getVersion() {
	if (releaseversion !== null) {
		return Promise.resolve(releaseversion)
	}
	return new Promise((resolve, reject) =>
		git.revParse({args: '--short HEAD', quiet: true}, (err, hash) => {
			if (err) reject(err)
			else {
				releaseversion = hash
				resolve(hash)
			}
		})
	)
}

async function imageName() {
	return `ghcr.io/studierlangsam/webseite:${await getVersion()}`
}

async function checkVersion() {
	console.log(`Deploying version ${await getVersion()}`);
}

async function devVersionName() {
	const versionName = process.env.DEV_VERSION_NAME
	if (!versionName) {
		throw new Error("please define the version name in the environment variable DEV_VERSION_NAME!")
	}
	return versionName
}

gulp.task('buildDocker',
	async () => await run(`docker build . -t ${await imageName()}`)()
);
gulp.task('pushDocker',
	async () => await run(`docker push ${await imageName()}`)()
);
gulp.task('deployKubernetes',
	async () => await run(`bash -c "` + (
		`kubectl kustomize deployment/live`
		+ ` | envsubst '$IMAGE'`
		+ ` | kubectl apply -f - --prune --selector app=studierlangsam.de,version=live --prune-whitelist=apps/v1/Deployment --prune-whitelist=/v1/Service --prune-whitelist=networking.k8s.io/v1/Ingress`
	) + `"`, {
		env: {
			IMAGE: await imageName()
		}
	})()
);


gulp.task('deployKubernetesDev',
	async () => await run(`bash -c "` + (
		`kubectl kustomize deployment/dev`
		+ ` | envsubst '$IMAGE $DEV_VERSION_NAME'`
		+ ` | kubectl apply -f - --prune --selector app=studierlangsam.de,version=$DEV_VERSION_NAME --prune-whitelist=apps/v1/Deployment --prune-whitelist=/v1/Service --prune-whitelist=networking.k8s.io/v1/Ingress`
	) + `"`, {
		env: {
			IMAGE: await imageName(),
			DEV_VERSION_NAME: await devVersionName()
		}
	})()
);
gulp.task('teardownKubernetesDev',
	async () => await run(`bash -c "` + (
		`kubectl kustomize deployment/dev`
		+ ` | envsubst '$IMAGE $DEV_VERSION_NAME'`
		+ ` | kubectl delete -f -`
	) + `"`, {
		env: {
			IMAGE: await imageName(),
			DEV_VERSION_NAME: await devVersionName()
		}
	})()
);

gulp.task('clean', cleanbuilddir);
gulp.task('build', gulp.parallel(style, content, graphics, images, miscstatic));
gulp.task('buildrelease', gulp.series(setreleasemode, 'clean', 'build', revision));
gulp.task('watch', gulp.series('clean', 'build', gulp.parallel(watch, serve)));
gulp.task('serverelease', gulp.series('buildrelease', serve));
gulp.task('check', gulp.series('clean', 'build', gulp.parallel(/*checkHTML, */'checkStyle')));
gulp.task('checkHTML', gulp.series(checkHTML));
const preDeploy = gulp.series(checkVersion, 'buildrelease', 'buildDocker', 'pushDocker')
gulp.task('deploy', gulp.series(preDeploy, 'deployKubernetes'));
gulp.task('deployDev', gulp.series(devVersionName, preDeploy, 'deployKubernetesDev'));
gulp.task('teardownDev', gulp.series(devVersionName, 'teardownKubernetesDev'))
