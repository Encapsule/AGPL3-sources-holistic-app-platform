// @encapsule/holarchy/server-api.js

const packageMeta = require("./package.json");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    services: {

        HealthCheck: require("./service-health-check"),
        MarkdownFromFilesystem: require("./service-fs-markdown-render"),
        OptionsAsHtmlContent: require("./service-options-as-html-content"),

        Developer_AppDataStoreIntegrations: require("./service-developer-get-app-data-store-integrations"),
        Developer_AppDataStoreFilterSpec: require("./service-developer-get-app-data-store-filter-spec")


    } // services

};

