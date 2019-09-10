"use strict";

// @encapsule/holarchy/server-api.js
module.exports = {
  library: {
    // Reusable @encapsule/holism service filters that an application can register on their own app server instance.
    // Unless otherwise indicated in comments below, these service filters are pre-built and exported as they
    // are intended to be registered via @encapsule/holism service configuration declaration(s). In other cases,
    // application developers must explicitly construct the service filter to register by providing additional
    // information to a factory filter that produces the final filter that is expected to be registered.
    //
    services: {
      HealthCheck: require("./server/services/service-health-check"),
      MarkdownFromFilesystem: require("./server/services/service-fs-markdown-render"),
      OptionsAsHtmlContent: require("./server/services/service-options-as-html-content"),
      Developer_AppDataStoreIntegrations: require("./server/services/service-developer-get-app-data-store-integrations"),
      Developer_AppDataStoreFilterSpec: require("./server/services/service-developer-get-app-data-store-filter-spec") // services

    }
  }
};