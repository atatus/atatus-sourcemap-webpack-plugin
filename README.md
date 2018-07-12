AtatusSourceMapPlugin
========================

This is a [Webpack](https://webpack.github.io) plugin that simplifies uploading the sourcemaps,
generated from a webpack build, to [Atatus](https://atatus.com).

Production JavaScript bundles are typically minified before deploying,
making Atatus stacktraces pretty useless unless you take steps to upload the sourcemaps.
You may be doing this now in a shell script, triggered during your deploy process,
that makes curl posts to the Atatus API. This can be finicky and error prone to setup.
AtatusSourceMapPlugin aims to remove that burden and automatically upload the sourcemaps when they are emitted by webpack.

## Installation
Install the plugin with npm:
```shell
$ npm install atatus-sourcemap-webpack-plugin --save-dev
```

## Basic Usage
An example webpack.config.js:
```javascript
const AtatusSourceMapPlugin = require('atatus-sourcemap-webpack-plugin')
const JS_PUBLIC_URL = 'https://my.cdn.net/assets'
const webpackConfig = {
  entry: 'index',
  url: JS_PUBLIC_URL,
  output: {
    path: 'dist',
    filename: 'index-[hash].js'
  },
  plugins: [new AtatusSourceMapPlugin({
    adminAPIKey: 'aaaabbbbccccddddeeeeffff00001111',
    version: 'version_string_here',
    url: JS_PUBLIC_URL
  })]
}
```

## Plugin Configuration
You can pass a hash of configuration options to `AtatusSourceMapPlugin`.
Allowed values are as follows:

#### `adminAPIKey: string` **(required)**
Your atatus project admin API Key

#### `version: string` **(required)**
A string identifying the version of your code this source map package is for. Typically this will be the full git sha.

#### `url: string` **(required)**
The base url for the cdn where your production bundles are hosted.

#### `includeChunks: string | [string]` **(optional)**
An array of chunks for which sourcemaps should be uploaded. This should correspond to the names in the webpack config `entry` field. If there's only one chunk, it can be a string rather than an array. If not supplied, all sourcemaps emitted by webpack will be uploaded, including those for unnamed chunks.

#### `silent: boolean` **(default: `false`)**
If `false`, success and warning messages will be logged to the console for each upload. Note: if you also do not want to see errors, set the `ignoreErrors` option to `true`.

#### `ignoreErrors: boolean` **(default: `false`)**
Set to `true` to bypass adding upload errors to the webpack compilation. Do this if you do not want to fail the build when sourcemap uploads fail. If you do not want to fail the build but you do want to see the failures as warnings, make sure `silent` option is set to `false`.

#### `atatusEndpoint: string` **(default: `https://api.atatus.com/api/browser/sourcemap`)**
A string defining the Atatus API endpoint to upload the sourcemaps to. It can be used for self-hosted Atatus instances.

## App Configuration
- The web app should have [atatus-browser](https://github.com/atatus/atatus-js) installed.
- See the [Atatus source map](https://www.atatus.com/docs/api/sourcemap) documentation
  for how to configure the client side for sourcemap support.
  The `code_version` parameter must match the `version` parameter used for the plugin.
- More general info on the using [Atatus for browser JS](https://www.atatus.com/docs/platforms/javascript).

## Examples
### React [(source)](https://github.com/atatus/atatus-sourcemap-webpack-plugin/tree/master/examples/react)
A minimal single page app with webpack build. The app includes a local Express server that
serves an index.html. The build is meant to mimic a production build in that js bundles.

To run the example:

  - Set your atatus options in `examples/react/webpack.config.babel.js`
  - `$ cd examples/react`
  - `$ npm run build`
  - `$ npm start`
  - open [http://localhost:8000](http://localhost:8000/)

  When the example app is loaded in a browser,
  the app will throw an error, which will be sent to Atatus.
  You should be able to log in to Atatus and see the error with stacktrace
  with line numbers that map to the original source.

## Contributing
See the [Contributors Guide](/CONTRIBUTING.md)

# License
[MIT](/LICENSE.md)
