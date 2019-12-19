
const arccore = require("@encapsule/arccore");
const getNamespaceInReferenceFromPathFilter = require("./filters/get-namespace-in-reference-from-path");
const dataPathResolveFilter = require("./filters/ocd-method-data-path-resolve-filter");

class ObservableControllerData {

    // request = { spec: filter descriptor object, data: variant }
    constructor(request_) {

        const factoryResponse = arccore.filter.create({
            operationID: "3aDV_cacQByO0tTzVrBxnA",
            operationName: "OCD Constructor Request Processor",
            operationDescription: "Validate/normalize data per input spec to deduce initial runtime value of the state data managed by an OPC class instance.",
            inputFilterSpec: request_.spec
        });
        if (factoryResponse.error) {
            throw new Error(factoryResponse.error);
        }
        const dataFilter = factoryResponse.result;

        const filterResponse = dataFilter.request(request_.data);
        if (filterResponse.error) {
            throw new Error(filterResponse.error);
        }

        // Private implementation state. Consumers of this class should not access the _private namespace; use class methods to interact with class instances instead.
        this._private = {
            storeData: filterResponse.result,
            storeDataSpec: dataFilter.filterDescriptor.inputFilterSpec,
            accessFilters: {
                read: {},
                write: {}
            }
        };

        // API methods... Use these methods.
        this.toJSON = this.toJSON.bind(this);
        this.readNamespace = this.readNamespace.bind(this);
        this.writeNamespace = this.writeNamespace.bind(this);
        this.getNamespaceSpec = this.getNamespaceSpec.bind(this);

    } // end constructor

    static dataPathResolve(request_) {
        return dataPathResolveFilter.request(request_);
    }

    toJSON() {
        // Only return the data; no other runtime state maintained by this class instance should ever be serialized.
        return this._private.storeData;
    }

    // Returns an arccore.filter-style response descriptor object.
    readNamespace(dataPath_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this._private.accessFilters.read[dataPath_]) {
                // Cache miss. Create a new read filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("read-filter" + dataPath_).result;
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: dataPath_, sourceRef: this._private.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error || !filterResponse.result) {
                    errors.push(`Cannot read controller data store namespace path '${dataPath_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `Controller Data Read Filter ${operationId}`,
                    operationDescription: `Validated/normalized read operations from OCD namespace '${dataPath_}'.`,
                    bodyFunction: () => { return getNamespaceInReferenceFromPathFilter.request({ namespacePath: dataPath_, sourceRef: this._private.storeData }); },
                    outputFilterSpec: targetNamespaceSpec,
                });
                if (filterResponse.error) {
                    errors.push(`Cannot read controller data store namespace path '${dataPath_}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created read filter.
                this._private.accessFilters.read[dataPath_] = filterResponse.result;
            } // if read filter doesn't exist
            const readFilter = this._private.accessFilters.read[dataPath_];
            methodResponse = readFilter.request();
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // readNamespace

    // Returns an arccore.filter-style response descriptor object.
    writeNamespace(dataPath_, value_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Determine if we have already instantiated a read filter for this namespace.
            if (!this._private.accessFilters.write[dataPath_]) {
                // Cache miss. Create a new write filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("write-filter" + dataPath_).result;
                const pathTokens = dataPath_.split(".");
                if (pathTokens.length < 2) {
                    errors.push(`Cannot write to controller data store namespace '${dataPath_}'; invalid attempt to overwrite the entire store.`);
                    break;
                } // if invalid write attempt
                const parentPath = pathTokens.slice(0, pathTokens.length - 1).join(".");
                const targetNamespace = pathTokens[pathTokens.length - 1];
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: dataPath_, sourceRef: this._private.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error || !filterResponse.result) {
                    errors.push(`Cannot write controller data store namespace path '${dataPath_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `Controller Data Write Filter ${operationId}`,
                    operationDescription: `Validated/normalized write to OCD namespace '${dataPath_}'.`,
                    inputFilterSpec: targetNamespaceSpec,
                    bodyFunction: (request_) => {
                        let response = { error: null, result: undefined };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            let innerResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: parentPath, sourceRef: this._private.storeData });
                            if (innerResponse.error) {
                                errors.push(`Unable to write to OCD namespace '${dataPath_}' due to an error reading parent namespace '${parentPath}'.`);
                                errors.push(innerResponse.error);
                                break;
                            }
                            let parentNamespace = innerResponse.result;
                            parentNamespace[targetNamespace] = request_; // the actual write
                            response.result = request_; // return the validated/normalized data written to the OCD
                            break;
                        }
                        if (errors.length) {
                            response.error = errors.join(" ");
                        }
                        return response;
                    },
                });
                if (filterResponse.error) {
                    errors.push(`Cannot write controller data store namespace path '${dataPath_}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created write filter.
                this._private.accessFilters.write[dataPath_] = filterResponse.result;
            } // if write filter doesn't exist
            const writeFilter = this._private.accessFilters.write[dataPath_];
            methodResponse = writeFilter.request(value_);
            break;
        } // end while
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // writeNamespace

    getNamespaceSpec(dataPath_) {
        let methodResponse = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: dataPath_, sourceRef: this._private.storeDataSpec, parseFilterSpec: true });
            if (filterResponse.error) {
                errors.push(`Cannot resolve a namespace descriptor in filter specification for path '${dataPath_}'.`);
                errors.push(filterResponse.error);
                break;
            } // if error
            methodResponse.result = filterResponse.result;
            break;
        }
        if (errors.length) {
            methodResponse.error = errors.join(" ");
        }
        return methodResponse;
    } // getNamespaceSpec

} // class ObservableControllerData

module.exports = ObservableControllerData;
