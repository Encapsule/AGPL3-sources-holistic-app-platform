// render-html-content.js
//
/*
  This module is a placeholder. At build time this module is compiled
  via webpack to produce two JavaScript application bundles.

  The first is loaded by the HTTP server at runtime via its HTML render
  integration filter to perform server-side HTML content rendering functions
  on behalf of the application. The second is referenced by the server-side-
  rendered HTML document and is loaded by the user's browser when the HTML
  document loads. In this second application bundle is a copy of the server's
  HTML rendering logic, view and data model contracts, and client-specific
  functionality
  
*/
//

const common = require('../../common');

module.exports = common.view.render;


