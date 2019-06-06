// @encapsule/holistic/SOURCES/LIB/holarchy/common/data/ApplictionDataStore.js
//

const arccore = require("@encapsule/arccore");
const appDataStoreConstructorFactory = require("./app-data-store-constructor-factory");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

class ApplicationDataStore {

    constructor(sharedAppDataStoreSpec_) {

        const factoryResponse = appDataStoreConstructorFactory.request(sharedAppDataStoreSpec_);
        if (factoryResponse.error) {
            throw new Error(
                [
                    "Unable to construct an ApplicationDataStore class instance due to an error in the application's shared data filter specification.",
                    factoryResponse.error
                ].join(" ")
            );
        } // if error

        const storeConstructorFilter = factoryResponse.result;

        const filterResponse = storeConstructorFilter.request();
        if (filterResponse.error) {
            throw new Error(
                [
                    "Unable to construct an ApplicationDataStore class instance due to an error executing the construction filter.",
                    filterResponse.error
                ].join(" ")
            );
        } // if error

        this.storeData = filterResponse.result;
        this.storeDataSpec = storeConstructorFilter.filterDescriptor.inputFilterSpec;

        this.accessFilters = { read: {}, write: {} };

        this.toJSON = this.toJSON.bind(this);
        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);

    } // end constructor


    toJSON() {
        // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
        return this.storeData;
    }

    // Returns an arccore.filter-style response descriptor object.
    readNamespace(path_) {

        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Determine if we have already instantiated a read filter for this namespace.
            if (!this.accessFilters.read[path_]) {
                // Cache miss. Create a new read filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this.storeDataSpec });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `App Data Filter ${operationId}`,
                    operationDescription: `Validate/normalize data for ADS namespace '${path_}'.`,
                    outputFilterSpec: targetNamespaceSpec
                });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created read filter.
                this.accessFilters.read[path_] = filterResponse.result;
            } // if read filter doesn't exist

            // const readFilter = this.accessFilters.read[path_];

        } // end while

        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }

        return methodResponse;

    } // readNamespace

    // Returns an arccore.filter-style response descriptor object.
    writeNamespace(path_, value_) {

        path_; value_;

    } // writeNamespace

}

module.exports = ApplicationDataStore;
