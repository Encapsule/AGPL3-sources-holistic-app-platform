// @encapsule/holistic/SOURCES/LIB/holarchy/common/data/ApplictionDataStore.js
//

const arccore = require("@encapsule/arccore");
const getNamespaceInReferenceFromPathFilter = require("./lib/get-namespace-in-reference-from-path");

class ApplicationDataStore {

    // request = { spec: object, data: variant }
    constructor(request_) {

        const factoryResponse = arccore.filter.create({
            operationID: "3aDV_cacQByO0tTzVrBxnA",
            operationName: "Aplication Data Store Constructor",
            operationDescription: "Constructs an in-memory data structure used to maintain shared application state data at runtime.",
            inputFilterSpec: request_.spec
        });
        if (factoryResponse.error) {
            throw new Error(factoryResponse.error);
        }
        const dataFilter = factoryResponse.result;

        const filterResponse = dataFilter.request(request_.data);
        if (filterResponse.error) {
            throw new Error(factoryResponse.error);
        }
        const data = filterResponse.result;

        // Private implementation state. Consumers of this class should not access the _private namespace; use class methods to interact with class instances instead.
        this._private = {
            storeData: data,
            storeDataSpec: request_.spec,
            accessFilters: {
                read: {},
                write: {}
            }
        };

        // API methods... Use these methods.
        this.toJSON = this.toJSON.bind(this);
        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);

    } // end constructor


    toJSON() {
        // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
        return this._private.storeData;
    }

    // Returns an arccore.filter-style response descriptor object.
    readNamespace(path_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this._private.accessFilters.read[path_]) {
                // Cache miss. Create a new read filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("read-filter" + path_).result;
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this._private.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `App Data Read Filter ${operationId}`,
                    operationDescription: `Validated/normalized read operations from ADS namespace '${path_}'.`,
                    bodyFunction: () => { return getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this._private.storeData }); },
                    outputFilterSpec: targetNamespaceSpec,
                });
                if (filterResponse.error) {
                    errors.push(`Cannot read app data store namespace path '${path_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created read filter.
                this._private.accessFilters.read[path_] = filterResponse.result;
            } // if read filter doesn't exist
            const readFilter = this._private.accessFilters.read[path_];
            methodResponse = readFilter.request();
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // readNamespace

    // Returns an arccore.filter-style response descriptor object.
    writeNamespace(path_, value_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this._private.accessFilters.write[path_]) {
                // Cache miss. Create a new write filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("write-filter" + path_).result;
                const pathTokens = path_.split(".");
                if (pathTokens.length < 2) {
                    errors.push(`Cannot write to app data store namespace '${path_}'; invalid attempt to overwrite the entire store.`);
                    break;
                } // if invalid write attempt
                const parentPath = pathTokens.slice(0, pathTokens.length - 1).join(".");
                const targetNamespace = pathTokens[pathTokens.length - 1];
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: path_, sourceRef: this._private.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error) {
                    errors.push(`Cannot write app data store namespace path '${path_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `App Data Write Filter ${operationId}`,
                    operationDescription: `Validated/normalized write to ADS namespace '${path_}'.`,
                    inputFilterSpec: targetNamespaceSpec,
                    bodyFunction: (request_) => {
                        let response = { error: null, result: undefined };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            let innerResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: parentPath, sourceRef: this._private.storeData });
                            if (innerResponse.error) {
                                errors.push(`Unable to write to ADS namespace '${path_}' due to an error reading parent namespace '${parentPath}'.`);
                                errors.push(innerResponse.error);
                                break;
                            }
                            let parentNamespace = innerResponse.result;
                            parentNamespace[targetNamespace] = request_; // the actual write
                            response.result = request_; // return the validated/normalized data written to the ADS
                            break;
                        }
                        if (errors.length) {
                            response.error = errors.join(" ");
                        }
                        return response;
                    },
                });
                if (filterResponse.error) {
                    errors.push(`Cannot write app data store namespace path '${path_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created write filter.
                this._private.accessFilters.write[path_] = filterResponse.result;
            } // if write filter doesn't exist
            const writeFilter = this._private.accessFilters.write[path_];
            methodResponse = writeFilter.request(value_);
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // writeNamespace

} // class ApplicationDataStore

module.exports = ApplicationDataStore;
