// sources/server/services/index.js

module.exports = {

    HealthCheck: require("./service-health-check"),

    MarkdownFromFilesystem: require("./service-fs-markdown-render"),

    OptionsAsContent: require("./options-as-content/service-options-as-html-content"),

    //////////////////////////////////////////////////////////////////////////

    DeveloperGetAppDataStoreIntegrations: require("./service-developer-get-app-data-store-integrations"),
    DeveloperGetAppDataStoreFilterSpec: require("./service-developer-get-app-data-store-filter-spec"),

    // RainierUXBaseDataGateway: require("./service-rainier-ux-data"),

};
