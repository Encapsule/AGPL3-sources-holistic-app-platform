// server-memory-files.js

const moduleDirectory = __dirname;
const path = require('path');

// Memory files are specified using a local filesystem path that's relative to the `config`
// subdirectory of the `deploy` directory.

const memoryFiles = {

    // ======================================================================
    // JAVASCRIPT
    // ======================================================================
    '../client/javascript/client-app-bundle.js': {
	request_bindings: { method: 'GET', uris: [ '/javascript/client-app-bundle.js' ]	},
	response_properties: { contentEncoding: 'utf8', contentType: 'application/javascript' }
    },

    // ======================================================================
    // STYLESHEETS
    // ======================================================================
    /*

      Not currently using ReactBootstrap so do not need these stylesheets ****

      '../client/css/bootstrap.min.css': {
      request_bindings: { method: 'GET', uris: [ '/css/bootstrap.min.css' ] },
      response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
      },
      '../client/css/bootstrap-theme.min.css': {
      request_bindings: { method: 'GET', uris: [ '/css/bootstrap-theme.min.css' ] },
      response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
      },
    */

    '../client/css/holistic.css': {
        request_bindings: { method: 'GET', uris: [ '/css/holistic.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },


    // ======================================================================
    // FONTS
    // ======================================================================
    /*
      Not currently using Bootstrap fonts (using Google Fonts instead)

      '../client/fonts/glyphicons-halflings-regular.woff2': {
      request_bindings: { method: 'GET', uris: [ '/fonts/glyphicons-halflings-regular.woff2' ] },
      response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
      },
      '../client/fonts/glyphicons-halflings-regular.woff': {
      request_bindings: { method: 'GET', uris: [ '/fonts/glyphicons-halflings-regular.woff' ] },
      response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff' }
      },
      '../client/fonts/glyphicons-halflings-regular.ttf': {
      request_bindings: { method: 'GET', uris: [ '/fonts/glyphicons-halflings-regular.ttf' ] },
      response_properties: { contentEncoding: 'binary', contentType: 'application/x-font-ttf' }
      },
    */

    // ======================================================================
    // IMAGES
    // ======================================================================

    '../client/images/seattle-emp-gehry-bronze-wall.jpg': {
        request_bindings: { uris: [ '/bronze-wall.jpg', '/images/bronze-wall.jpg' ], method: 'GET' },
        response_properties: { contentEncoding: 'binary', contentType: 'image/jpeg' }
    },

    '../client/images/twitter.svg': {
        request_bindings: { uris: [ '/images/twitter.svg' ], method: 'GET' },
        response_properties: { contentEncoding: 'binary', contentType: 'image/svg+xml' }
    },
    '../client/images/github-octocat.svg': {
        request_bindings: { uris: [ '/images/github-octocat.svg' ], method: 'GET' },
        response_properties: { contentEncoding: 'binary', contentType: 'image/svg+xml' }
    },


    // TODO: deprecate these as soon as npm package logos are updated for all packages.
    // https://encapsule.io/images/blue-burst-encapsule.io-logo-251x64.png
    // v DEPRECATE ASAP
    '../client/images/blue-burst-encapsule.io-logo-251x64.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-logo-251x64.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-logo.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-logo.svg' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/svg+xml' }
    },
    // ^ DEPRECATE ASAP

    '../client/images/blue-burst-encapsule.io-icon-16x16.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-16x16.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-24x24.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-24x24.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-32x32.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-32x32.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-48x48.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-48x48.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-56x56.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-56x56.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-64x64.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-64x64.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-72x72.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-72x72.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-96x96.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-96x96.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-1024x1024.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-1024x1024.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-1024x1024.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-1024x1024.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-490x478.png': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-490x478.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/blue-burst-encapsule.io-icon-v2.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/blue-burst-encapsule.io-icon-v2.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-util.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-util.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-types.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-types.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-identifier.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-identifier.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-graph.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-graph.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-filter.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-filter.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-filter-32x32.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-filter-32x32.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-arccore-filter-32x32.png': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-filter-32x32.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/encapsule-arccore-discriminator.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-arccore-discriminator.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-hrequest.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-hrequest.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-holism.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-holism.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-holism-32x32.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-holism-32x32.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-holism-32x32.png': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-holism-32x32.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/encapsule-holistic.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-holistic.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-folder-icon.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-folder-icon.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },
    '../client/images/encapsule-document-icon.svg': {
        request_bindings: { method: 'GET', uris: [ '/images/encapsule-document-icon.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },

    '../client/images/begin-at-the-beginning.jpg': {
        request_bindings: { method: 'GET', uris: [ '/images/begin-at-the-beginning.jpg' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/jpeg' }
    },

    '../client/images/ITA-23.4.gif': {
        request_bindings: { method: 'GET', uris: [ '/images/ITA-23.4.gif' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/gif' }
    },




    // ----------------------------------------------------------------------
    // Favorites icon
    // ----------------------------------------------------------------------
    '../client/images/favicon.ico': {
	request_bindings: { uris: [ '/favicon.ico', '/images/favicon.ico' ], method: 'GET' },
	response_properties: { contentEncoding: 'binary', contentType: 'image/x-icon' }
    },
    '../client/images/android-icon-192x192.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-192x192.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/android-icon-144x144.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-144x144.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/android-icon-96x96.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-96x96.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/android-icon-72x72.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-72x72.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/android-icon-48x48.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-48x48.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/android-icon-36x36.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/android-icon-36x36.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-114x114.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-114x114.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-120x120.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-120x120.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-144x144.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-144x144.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-180x180.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-180x180.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-57x57.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-57x57.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-60x60.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-60x60.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/apple-icon-72x72.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/apple-icon-72x72.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/favicon-16x16.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/favicon-16x16.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/favicon-32x32.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/favicon-32x32.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/favicon-96x96.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/favicon-96x96.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/ms-icon-144x144.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/ms-icon-144x144.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/ms-icon-150x150.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/ms-icon-150x150.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/ms-icon-310x310.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/ms-icon-310x310.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/ms-icon-70x70.png' : {
        request_bindings: { method: 'GET', uris: [ '/images/ms-icon-70x70.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },
    '../client/images/manifest.json' : {
        request_bindings: { method: 'GET', uris: [ '/images/manifest.json' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'application/json' }
    },


    // ======================================================================
    // OTHER
    // ======================================================================
    '../robots.txt': {
	request_bindings: { method: 'GET', uris: [ '/robots.txt' ] },
	response_properties: { contentEncoding: 'utf8', contentType: 'text/plain' }
    },

    '../client/index.html': {
	request_bindings: { method: 'GET', uris: [ '/index.html' ] },
	response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },




};

var result = {};
for (var filepath_ in memoryFiles) {
    result[path.join(moduleDirectory, filepath_)] = memoryFiles[filepath_];
}
module.exports = result;
