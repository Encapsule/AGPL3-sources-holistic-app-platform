// common.js
//

const holisticAppMetadataStoreConstructorFactory = require("./common/metadata/metadata-store-constructor-factory");


// const reactComponentBindingFilterFactory = require("./common/view/component-router/react-component-binding-filter-factory");

module.exports = {
    // Factories are filters that construct filters.
    factories: {
        metadata: {
            makeConstructorFilter: holisticAppMetadataStoreConstructorFactory
        },
        view: {
            // reactComponentBindingFilter: reactComponentBindingFilterFactory
        }
    }
};
