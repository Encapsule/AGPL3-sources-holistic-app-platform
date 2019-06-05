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

        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);

    } // end constructor


    readNamespace(path_) {

        if (!this.accessFilters.read[path_]) {
            const operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
            let response = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this.storeDataSpec });
            if (response.error) {
                throw new Error(
                    [
                        "Cannot read app data store namespace path '" + path_ + "' because it's not possible to construct a read filter for this namespace.",
                        response.error
                    ].join(" ")
                );
            } // if error
            const targetNamespaceSpec = response.result;
            response = arccore.filter.create({
                operationID: operationId,
                operationName: "App Data Read Filter " + operationId,
                operationDescription: "Performs a filtered read operation on shared app data store namespace '" + path_ + "'.",
                inputFilterSpec: targetNamespaceSpec
            });
            if (response.error) {
                throw new Error(
                    [
                        "Cannot read app data store namespace path '" + path_ + "' because it's not possible to construct a read filter for this namespace.",
                        response.error
                    ].join(" ")
                );
            } // if error
            this.accessFilters.read[path_] = response.result;
        }

    } // readNamespace

    writeNamespace(path_, value_) {

        path_; value_;

    } // writeNamespace

}

module.exports = ApplicationDataStore;
