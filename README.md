# studierlangsam.de Website

This website is written using [Svelte](https://svelte.dev/), a component language that compiles to static HTML as much as possible.
Styling is done in [SCSS](http://sass-lang.com/).
The site can is built by [vite](https://vitejs.dev/), using [SvelteKit](https://kit.svelte.dev/).
The setup is based on [create-svelte](https://github.com/sveltejs/kit/tree/master/packages/create-svelte)

## Getting started

To build the page, you need to install Node JS.
See [the official download page](https://nodejs.org/en/download/) for Windows and Mac and the [official documentation for package managers](https://nodejs.org/en/download/package-manager/) for Linux distributions.

Then you can install all dependencies by running `npm install` from the project folder.

### Important commands
 * `npm run dev` to start a development server on `localhost:5179` that automatically updates the site as you make changes to the source code.
 * `npm run build` to create a production build of the site in the `build` folder.
 * `npm run preview` to start a server on `localhost:4173` for the production build. The server will not update automatically. You need to run `npm run build` again and re-start `npm run preview` to see changes.
 * `npm run check` to check the source files against the coding conventions.
 * `npm run list` to check the source files’ formatting.
 * `npm run format` to fix the source files’ formatting.

## Project structure

The project consists of these folders:

* `.github/workflows` contains the build job definitions.
* `.svelte-kit` (not in git) contains generated biuld files.
* `build` (not in git) contains the production build of the page.
* `deployment` contains the configuration for the Kubernetes resources that are used to deploy the website.
* `node_modules` (not in git) is used by `npm` to store dependencies.
* `src` contains the source code:
  * `src/lib` contains the Svelte components and their logic.
  * `src/routes` defines the pages of the website.
  * `src/style` contains the externalized style definitions.
  * `src/svg` contains graphics in the SVG format.