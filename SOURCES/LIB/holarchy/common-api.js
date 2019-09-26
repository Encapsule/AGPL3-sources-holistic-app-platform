// common.js
//

// Holistic metadata store related common data subsystem exports...

const appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory");

const ApplicationDataStore = require("./common/data/ApplicationDataStore");

module.exports = {

    ApplicationDataStore: ApplicationDataStore,

    // TODO: Create a little ES6 class to abstract metadata store.
    ApplicationMetadataStore: {
        // Creates an application-specific application metadata store constructor filter.
        makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
    }

};
