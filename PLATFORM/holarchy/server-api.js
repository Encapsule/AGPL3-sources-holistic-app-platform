
const holism = require("@encapsule/holism");

const ruxAppServerFactory = require("./server/server-factory");

const ruxBaseSharedHolismServiceFilters = {
    OptionsAsContent: require("./sources/server/services/options-as-content/service-options-as-html-content"),
    OptionsAsContentNoAuth: require("./sources/server/services/options-as-content/service-options-as-html-content-no-auth"),
    MarkdownFromFilesystem: require("./sources/server/services/service-fs-markdown-render"),
    HealthCheck : require("./sources/server/services/service-health-check"),

    developer: {
        AppDataStoreIntegrations: require("./sources/server/services/service-developer-get-app-data-store-integrations"),
        AppDataStoreFilterSpec: require("./sources/server/services/service-developer-get-app-data-store-filter-spec")
    }
};

module.exports = {

    factories: {

        server: {
            // Delegate to rainier-ux-base to create an Encapsule/holism Node.js application server instance
            // that is specialized by rainier-ui-base for Quantcast. And, further extended and specialized
            // per the derived-application's call to the application server factory.
            application: ruxAppServerFactory,

            // Delegate to Encapsule/holism application server service filter factory.
            service: holism.service.create
        }
    },

    library: {

        // Shared Encapsule/holism service filters defined by rainier-ux-base that the derived application can re-use
        // to register application-specific server routes via the config.services in-parameter to the server application factory.

        services: ruxBaseSharedHolismServiceFilters

    }

};

