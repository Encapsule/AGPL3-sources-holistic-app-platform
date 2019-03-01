"use strict";

// @encapsule/holarchy/server-api.js
var holism = require("@encapsule/holism");

var ruxAppServerFactory = require("./server/server-factory");

module.exports = {
  factories: {
    server: {
      application: ruxAppServerFactory,
      service: holism.service.create
    }
  },
  library: {
    services: {
      OptionsAsContentNoAuth: require("./sources/server/services/options-as-content/service-options-as-html-content-no-auth"),
      MarkdownFromFilesystem: require("./sources/server/services/service-fs-markdown-render"),
      HealthCheck: require("./sources/server/services/service-health-check"),
      developer: {
        AppDataStoreIntegrations: require("./sources/server/services/service-developer-get-app-data-store-integrations"),
        AppDataStoreFilterSpec: require("./sources/server/services/service-developer-get-app-data-store-filter-spec")
      }
    }
  }
};