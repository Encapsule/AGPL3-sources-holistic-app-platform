// @encapsule/holarchy/server-api.js

module.exports = {
    library: {
        services: {
            HealthCheck : require("./server/services/service-health-check"),
            MarkdownFromFilesystem: require("./server/services/service-fs-markdown-render"),
            OptionsAsHtmlContent: require("./server/services/service-options-as-html-content"),
            developer: {
                AppDataStoreIntegrations: require("./server/services/service-developer-get-app-data-store-integrations"),
                AppDataStoreFilterSpec: require("./server/services/service-developer-get-app-data-store-filter-spec")
            }
        }
    }
};

