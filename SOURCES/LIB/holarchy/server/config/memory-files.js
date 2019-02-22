// server/config/memory-files.js
//

const path = require('path');
const dirname = __dirname;

//const process = require('process');
//console.log("Processing memory-files.js");
//console.log("... the current working directory '" + process.cwd() + "'");
//console.log("... the __dirname symbol is '" + __dirname + "'");

/*
  Assume that all resource paths are relative to the `build` or `deploy` directories;
  the `_resources` subdirectory is created by gulp tasks.
*/

const memoryFiles = {

    // ---------------------------------------------------------------------------
    // Robots & spiders
    // Indicate that all user agents should go ahead and index this HTTP application.
    // ---------------------------------------------------------------------------

    '_resources/html/robots.txt': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/robots.txt' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/plain' },
    },

    // ---------------------------------------------------------------------------
    // Static HTML resources
    // ---------------------------------------------------------------------------


    // ---------------------------------------------------------------------------
    // Static CSS resources
    // ---------------------------------------------------------------------------

    '_resources/css/rainier-ux-base-core-fonts.css': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/css/rainier-ux-base-core-fonts.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },

    '_resources/css/rainier-ux-base.css': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/css/rainier-ux-base.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },

    // Download of: https://unpkg.com/@blueprintjs/datetime@1.22.0/dist/blueprint-datetime.css
    '_resources/css/blueprint-datetime.css': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/css/blueprint-datetime.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },

    // Download of: https://unpkg.com/@blueprintjs/core@1.31.0/dist/blueprint.css
    '_resources/css/blueprint.css': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/css/blueprint.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },

    // Download of: https://unpkg.com/normalize.css@4.2.0/normalize.css
    '_resources/css/normalize.css': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/css/normalize.css' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/css' }
    },

    // ---------------------------------------------------------------------------
    // Static Font resources
    // ---------------------------------------------------------------------------

    '_resources/fonts/SKK6Nusyv8QPNMtI4j9J2wsYbbCjybiHxArTLjt7FRU.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/SKK6Nusyv8QPNMtI4j9J2wsYbbCjybiHxArTLjt7FRU.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/gFXtEMCp1m_YzxsBpKl68gsYbbCjybiHxArTLjt7FRU.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/gFXtEMCp1m_YzxsBpKl68gsYbbCjybiHxArTLjt7FRU.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/zhcz-_WihjSQC0oHJ9TCYAzyDMXhdD8sAj6OAJTFsBI.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/zhcz-_WihjSQC0oHJ9TCYAzyDMXhdD8sAj6OAJTFsBI.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/DbmoEiLFv2l2THgnoltNxn-_kf6ByYO6CLYdB4HQE-Y.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/DbmoEiLFv2l2THgnoltNxn-_kf6ByYO6CLYdB4HQE-Y.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/Ja-W2r1mUFvMx9Mn05mLi3-_kf6ByYO6CLYdB4HQE-Y.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/Ja-W2r1mUFvMx9Mn05mLi3-_kf6ByYO6CLYdB4HQE-Y.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/6TbRXKWJjpj6V2v_WyRbMevvDin1pK8aKteLpeZ5c0A.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/6TbRXKWJjpj6V2v_WyRbMevvDin1pK8aKteLpeZ5c0A.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/pRwQShtu0DpIJxaghUjyThTbgVql8nDJpwnrE27mub0.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/pRwQShtu0DpIJxaghUjyThTbgVql8nDJpwnrE27mub0.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/vag-4zh7veZxuXQd3EqJ8RTbgVql8nDJpwnrE27mub0.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/vag-4zh7veZxuXQd3EqJ8RTbgVql8nDJpwnrE27mub0.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/kEQ0PMpkuDY-ekJA13N_lxTbgVql8nDJpwnrE27mub0.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/kEQ0PMpkuDY-ekJA13N_lxTbgVql8nDJpwnrE27mub0.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/V7J2dBs3_g80-KE4D0R0whTbgVql8nDJpwnrE27mub0.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/V7J2dBs3_g80-KE4D0R0whTbgVql8nDJpwnrE27mub0.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/7FOHgXzNXtomMvoUz-Mv4xTbgVql8nDJpwnrE27mub0.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/7FOHgXzNXtomMvoUz-Mv4xTbgVql8nDJpwnrE27mub0.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/ldG7L03dPLLtYDea50KtQfesZW2xOQ-xsNqO47m55DA.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/ldG7L03dPLLtYDea50KtQfesZW2xOQ-xsNqO47m55DA.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/RQxK-3RA0Lnf3gnnnNrAsVlgUn8GogvcKKzoM9Dh-4E.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/RQxK-3RA0Lnf3gnnnNrAsVlgUn8GogvcKKzoM9Dh-4E.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/fontawesome-webfont.woff2': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/fontawesome-webfont.woff2' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff2' }
    },

    '_resources/fonts/fontawesome-webfont.woff': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/fontawesome-webfont.woff' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff' }
    },

    '_resources/fonts/fontawesome-webfont.ttf': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/fonts/fontawesome-webfont.ttf' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/x-font-ttf' }
    },

    // ---------------------------------------------------------------------------
    // Icon resources
    // ---------------------------------------------------------------------------
    '_resources/icons/icons-16.woff': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/resources/icons/icons-16.woff' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/font-woff' }
    },

    '_resources/icons/icons-16.ttf': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/resources/icons/icons-16.ttf' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'application/x-font-ttf' }
    },


    // ---------------------------------------------------------------------------
    // Static JavaScript resources
    // ---------------------------------------------------------------------------
    'client-app-bundle.js': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/javascript/client-app-bundle.js' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'application/javascript' }
    },

    // ---------------------------------------------------------------------------
    // Static favicon resources
    // ---------------------------------------------------------------------------

    '_resources/images/favicon.ico': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/favicon.ico', '/images/favicon.ico' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/x-icon' }
    },

    '_resources/images/apple-touch-icon-114x114.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-114x114.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-120x120.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-120x120.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-144x144.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-144x144.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-152x152.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-152x152.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-57x57.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-57x57.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-60x60.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-60x60.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-72x72.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-72x72.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/apple-touch-icon-76x76.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/apple-touch-icon-76x76.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/favicon-128.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/favicon-128.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/favicon-16x16.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/favicon-16x16.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/favicon-196x196.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/favicon-196x196.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/favicon-32x32.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/favicon-32x32.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/mstile-144x144.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/mstile-144x144.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/mstile-150x150.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/mstile-150x150.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/mstile-310x150.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/mstile-310x150.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/mstile-310x310.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/mstile-310x310.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    '_resources/images/mstile-70x70.png': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/mstile-70x70.png' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/png' }
    },

    // ---------------------------------------------------------------------------
    // Static icons, logos, etc.
    // ---------------------------------------------------------------------------

    '_resources/images/quantcast-logo.svg': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/quantcast-logo.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },

    '_resources/images/json-doc.svg': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/json-doc.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },

    '_resources/images/react-logo.svg': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/react-logo.svg' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'image/svg+xml' }
    },

    // ---------------------------------------------------------------------------
    // Error page graphics
    // ---------------------------------------------------------------------------

    '_resources/images/warp-factor-one.gif': {
        request_bindings: { method: 'GET', uris: [ '/advertise/rainier/images/warp-factor-one.gif' ] },
        response_properties: { contentEncoding: 'binary', contentType: 'image/gif' }
    }

};

var result = {};
for (var filename_ in memoryFiles) {
    var filepath = path.join(__dirname,  filename_);
    result[filepath] = memoryFiles[filename_];
}

module.exports = result;
