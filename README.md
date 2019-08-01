# studierlangsam.de Website

This website is written using [Pug](https://pugjs.org/api/getting-started.html), a template language.
Styling is done in [SCSS](http://sass-lang.com/).
The site can be built using [gulp](http://gulpjs.com/).

## Getting started

To build the page, you need to install Node JS.
See [the official download page](https://nodejs.org/en/download/) for Windows and Mac and the [official documentation for package managers](https://nodejs.org/en/download/package-manager/) for Linux distributions.

Then you can install all dependencies by running `npm install` from the project folder.

Additionally, you’ll need to install [`graphicsmagick`](http://www.graphicsmagick.org/) and [`imagemagick`](https://www.imagemagick.org/script/index.php).
For more information about that, see [`gulp-image-resize`](https://www.npmjs.com/package/gulp-image-resize).
On Debian, run:

```
sudo apt install imagemagick graphicsmagick
```

In order install gulp’s CLI globally (which is *much* more comfortable), run (on Debian):

```
sudo npm install gulp-cli -g
```

## Overview

The project consists of these folders:

 * `build` (not in git) contains the development build of the page.
 * `content` contains the content pages. These pages use the layouts from the `layout` folder. The contained `.pug` files will be rendered using [Pug](https://pugjs.org/api/getting-started.html) and be copied to the web page root. Any file `[name].pug` will be copied to `[name]/index.html` if `[name]` is not already `index`. Keep that in mind when creating links!
 * `graphic` contains graphics that are part of the pages’ layout. The folder will be copied to the web page without modification. Some contained SVG pages will be inlined into the rendered HTML pages.
 * `images` contains content images in their original resolution and quality. They will be copied to the web page after being scaled as needed.
 * `layout` contains [Pug](https://pugjs.org/api/getting-started.html) files that form the page’s layout. These layouts are used in the content pages using [Pug’s Inheritance and Blocks](https://pugjs.org/language/inheritance.html) mechanism.
 * `node_modules` (not in git) is used by `npm` to store dependencies.
 * `release` (not in git) contains the release build of the page. These are the exact files that will be uploaded by `gulp deploy`.
 * `script` contains Javascript files for the page. They are currently not copied to the web pages as all scripts are being inlined into the result HTML.
 * `style` contains [SCSS](http://sass-lang.com/) files that will be rendered into the web page.

## Building

There are *two* types of builds for this project: Development builds and release builds.
The page should look the same for both builds.
However, the results produced by a development build are better suited for debugging, while the results of a release build are significantly better optimised.

During development, run `gulp watch` from the project folder.
This will start a development server at `localhost:3000` (or the next free port after that).
The page is automatically rebuilt and reloaded in the browser as you make changes to the source files.

To check the source files against the coding conventions, run `gulp check` from the project folder.

In order to upload the site to the production server, you need to have [`docker`](https://docs.docker.com/install/) and [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed.
Additionally, you have to ask Joshua Gleitze (mail@joshuagleitze.de) for credentials.
After that, you can upload the page by running `gulp deploy --dversion <version>` from the project folder.
The command will produce a release build, build a docker image with it, and deploy a container using the image.
Replace `<version>` in the command with the new deployment version.
Please pick the new deployment version according to [Semantic Versioning](https://semver.org/) rules.
You can query the currently deployed version by running:
```
kubectl -n studierlangsam get pod --selector app=studierlangsam.de --output "custom-columns=deployed image:.spec.containers[0].image"
```


If you want to preview what *exactly* will be uploaded, run `gulp serverelease`.
The command serves the release build through a local web server.
It will however, unlike `gulp watch`, not pick up any changes to the source files.

## Writing

When writing, please look at other pages to get the general structure and style of this project. Some notes:

 * Helper mixins, like for creating mail links and including emojis, can be found in `layout/mixins`.
   Please look at what is already there and always use the mixins if applicable.
   Feel free to add other helper mixins there and include them in `layout/base.pug`.
 * Content pages should set page metadata in the Pug block `properties` by defining them as Javascript constants.
   Constants that should always be set are `Titel` (page title), `Link` (URI path to the page) and `Schlagwörter` (keywords for the page).
   Other constants can be set for later usage in the page.
 * Try to keep the markup simple.
   For example, long links should be defined in constants and used from that constants to improve readability.
   Such constants are named in German and using uppercased words and underscores by convention.
