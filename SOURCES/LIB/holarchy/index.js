const packageMeta = require("./package.json");
const appMetadataStoreConstructorFilterFactory = require("./app-metadata-store/metadata-store-constructor-factory");
const ApplicationDataStore = require("./app-data-store/ApplicationDataStore");
const ApplicationStateController = require("./app-state-controller/ApplicationStateController");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // ES6 class instantiated with operator new.
    ApplicationDataStore: ApplicationDataStore,

    ApplicationMetadataStore: { // TODO: Create a little ES6 class to abstract metadata store.

        // Creates an application-specific application metadata store constructor filter.
        makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
    },

    ApplicationStateController: ApplicationStateController


};
