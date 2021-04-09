"use strict";

// app-service-core-specializations.js
(function () {
  module.exports = {
    appTypes: {
      appMetadata: {
        orgExt: undefined,
        appExt: undefined,
        pageExt: undefined,
        hashrouteExt: undefined
      },
      userLoginSession: {
        untrusted: {
          clientUserLoginSessionSpec: {
            ____accept: ["jsNull", "jsObject"]
          }
        }
      }
    },
    appData: {
      appBuild: require("../app-build"),
      // <- produced by appgen-created Makefile at the start of 'yarn build' from values in your holistic-app.json.
      appMetadata: {
        // org will soon be deprecated and the information will be obtained from request.appBuild (Makefile + holistic-app.json -> app-build.json)
        org: require("./metadata/app-metadata-org-values"),
        // app will soon be deprecated and the information will be obtained from request.appBuild (Makefile + holistic-app.json -> app-build.json)
        app: require("./metadata/app-metadata-app-values"),
        // Server-side page view registrations.
        pages: require("./metadata/app-metadata-page-values"),
        // Client-side page view registrations.
        hashroutes: require("./metadata/app-metadata-hashroute-values")
      }
    },
    appModels: {
      cellModels: [],
      display: {// d2r2Components: require("./display")
      }
    }
  };
})();