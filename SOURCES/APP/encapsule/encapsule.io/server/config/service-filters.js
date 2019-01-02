// server-services.js

// Platform debugging services.
const serverIntrospectionFilter = require('../services/server-introspection-json-filter');
const aboutServerHtmlPageFilter = require('../services/about-server-html-filter');

// User services.
const userAccountCreateFilter = require('../services/user-account-create-filter');
const userSessionOpenServiceFilter = require('../services/user-session-open-filter');

// Content services.

const staticContentRouterFilter = require('../services/static-content-router-filter');

const markdownContentReaderFilter = require('../services/markdown-content-reader-filter');


const homepageContentFilter = require('../services/homepage-content-filter');



// Services configuration descriptor object.
module.exports = [

    {
        filter: serverIntrospectionFilter,
        request_bindings: { method: "GET", uris: [ '/introspect' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },

    {
        filter: aboutServerHtmlPageFilter,
        request_bindings: { method: "GET", uris: [ '/info' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },

    {
        filter: userAccountCreateFilter,
        request_bindings: { method: "POST", uris: [ '/user_account_create' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'application/json' }
    },

    {
	filter: userSessionOpenServiceFilter,
	request_bindings: { method: "POST", uris: [ '/user_session_open' ] },
	response_properties: { contentEncoding: 'utf8', contentType: 'application/json'	}
    },


    {
        filter: staticContentRouterFilter,
        request_bindings: { method: "GET", uris: [ '/admin' ] },
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },


    {
        filter: staticContentRouterFilter,
        request_bindings: { method: "GET", uris: [ '/admin/account/create' ] },
        options: { "w2VVlT_MTiuGVjj3xEcR3g": {}},
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },

    {
        filter: staticContentRouterFilter,
        request_bindings: { method: "GET", uris: [ '/login' ] },
        options: { "5HmrACzSReyM36f0vJrqlQ": {}},
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },

    {
        filter: staticContentRouterFilter,
        request_bindings: { method: "GET", uris: [ '/logout' ] },
        options: { "dPcvzdVrSqGe1Sb14em_DQ": {}},
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }
    },

    {
        filter: staticContentRouterFilter,
        request_bindings: { method: "GET", uris: [ '/sitemap' ] },
        options: { "f-6SHm2QQMKgTh4HmW9q5A": {}}, // HolisticSitemap content render request
        response_properties: { contentEncoding: 'utf8', contentType: 'text/html' }

    },

    /*
      {
      filter: null,
      request_binding: {
      method: "POST",
      uris: [ '/user_session_msg' ]
      },
      response_properties: {
      contentEncoding: 'utf8',
      contentType: 'application/json'
      }
      },

      {
      filter: null,
      request_binding: {
      method: "POST",
      uris: [ '/user_session_close' ]
      },
      response_properties: {
      contentEncoding: 'utf8',
      contentType: 'application/json'
      }
      }
    */
];
