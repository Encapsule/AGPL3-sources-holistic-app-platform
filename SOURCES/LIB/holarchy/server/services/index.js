// sources/server/services/index.js

module.exports = {

    MarkdownFromFilesystem: require('./service-fs-markdown-render'),

    OptionsAsContent: require('./options-as-content/service-options-as-html-content'),
    OptionsAsContentNoAuth: require('./options-as-content/service-options-as-html-content-no-auth'),

    HealthCheck: require('./service-health-check'),

    //////////////////////////////////////////////////////////////////////////

    DeveloperGetAppDataStoreIntegrations: require('./service-developer-get-app-data-store-integrations'),
    DeveloperGetAppDataStoreFilterSpec: require('./service-developer-get-app-data-store-filter-spec'),


    //////////////////////////////////////////////////////////////////////////
    // Client HTML5 application requests for Rainier platform data are sent to the derived application's
    // Encapsule/holism-derived Node.js server. The following services encapsulate proxied requests to
    // the actual Rainier backend service (API and RMS).

    RainierUXBaseDataGateway: require('./service-rainier-ux-data'),

};
