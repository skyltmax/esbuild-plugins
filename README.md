# esbuild-plugins

Some [esbuild](https://esbuild.github.io/) plugins for convenience.

* livereload - When esbuild is running in watch mode injects script to autoreload page when build finishes.
* postcss - Process imported CSS files with PostCSS.
* tslint - Since esbuild doesn't do type checking this plugin runs `tsc` in the background and fails build if errors are found.
* yaml - Import YAML files as JS objects.
