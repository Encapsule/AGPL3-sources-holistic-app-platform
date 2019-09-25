// common.js
//

// Holistic metadata store related common data subsystem exports...

// TODO: Consider flipping this into an ES6 class as well.
const appMetadataStoreConstructorFilterFactory = require("./common/metadata/metadata-store-constructor-factory");

const ApplicationDataStore = require("./common/data/ApplicationDataStore");

module.exports = {

    ApplicationDataStore: ApplicationDataStore,

    ApplicationMetadataStore: {
        // Creates an application-specific application metadata store constructor filter.
        makeInstanceConstructor: appMetadataStoreConstructorFilterFactory
    }

};
