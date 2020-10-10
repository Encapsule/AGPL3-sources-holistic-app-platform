// ocd-method-write-namespace-filter.js

const arccore = require("@encapsule/arccore");
const ocdMethodPathSpec = require("./iospecs/ocd-method-path-spec");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

const factoryResponse = arccore.filter.create({
    operationID: "NqAyu1cLQQyX0w95zaQt6A",
    operationName: "OCD::writeNamespace Method Filter",
    operationDescription: "Implementes ObservableControllerData.writeNamespace method.",

    inputFilterSpec: {
        ____label: "OCD Write Namespace Request",
        ____types: "jsObject",
        ocdClass: {
            ____label: "OCD Class Reference",
            ____description: "A reference to the OCD class constructor so that this filter can call static methods defined on the class prototype.",
            ____opaque: true
        },
        ocdReference: {
            ____label: "OCD Instance Reference",
            ____description: "A reference to the calling OCD class instance.",
            ____opaque: true
        },
        path: ocdMethodPathSpec,
        data: {
            ____label: "Write Data",
            ____opaque: true
        }
    },
    outputFilterSpec: {
        ____label: "OCD Read Namepace Result",
        ____opaque: true // Result depends on the namespace's filter specification
    }, // outputFilterSpec


    bodyFunction: function(request_) {

        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let fqPath = null;
            switch (Object.prototype.toString.call(request_.path)) {
            case "[object String]":
                fqPath = request_.path;
                break;
            case "[object Object]":
                let rpResponse = request_.ocdClass.dataPathResolve({ apmBindingPath: request_.path.apmBindingPath, dataPath: request_.path.dataPath });
                if (rpResponse.error) {
                    errors.push(rpResponse.error);
                } else {
                    fqPath = rpResponse.result;
                }
                break;
            }
            if (errors.length) {
                break;
            }

            // Determine if we have already instantiated a read filter for this namespace.
            if (!request_.ocdReference._private.accessFilters.write[fqPath]) {
                // Cache miss. Create a new write filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("write-filter" + fqPath).result;
                const pathTokens = fqPath.split(".");
                if (pathTokens.length < 2) {
                    errors.push(`Cannot write to controller data store namespace '${fqPath}'; invalid attempt to overwrite the entire store.`);
                    break;
                } // if invalid write attempt
                const parentPath = pathTokens.slice(0, pathTokens.length - 1).join(".");
                const targetNamespace = pathTokens[pathTokens.length - 1];
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: fqPath, specRef: request_.ocdReference._private.storeDataSpec });
                if (filterResponse.error || !filterResponse.result) {
                    errors.push(`Cannot write controller data store namespace path '${fqPath}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `Controller Data Write Filter ${operationId}`,
                    operationDescription: `Validated/normalized write to OCD namespace '${fqPath}'.`,
                    inputFilterSpec: targetNamespaceSpec,
                    bodyFunction: (data_) => {
                        let response = { error: null, result: undefined };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            let innerResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: parentPath, dataRef: request_.ocdReference._private.storeData, specRef: request_.ocdReference._private.storeDataSpec });
                            if (innerResponse.error) {
                                errors.push(`Unable to write to OCD namespace '${fqPath}' due to an error reading parent namespace '${parentPath}'.`);
                                errors.push(innerResponse.error);
                                break;
                            }
                            let parentNamespace = innerResponse.result;
                            // the actual write & return the validated/normalized data written to the OCD store.
                            parentNamespace[targetNamespace] = response.result = data_;
                            break;
                        }
                        if (errors.length) {
                            response.error = errors.join(" ");
                        }
                        return response;
                    },
                });
                if (filterResponse.error) {
                    errors.push(`Cannot write controller data store namespace path '${fqPath}' because it is not possible to construct a write filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created write filter.
                request_.ocdReference._private.accessFilters.write[fqPath] = filterResponse.result;
            } // if write filter doesn't exist
            const writeFilter = request_.ocdReference._private.accessFilters.write[fqPath];
            response = writeFilter.request(request_.data);
            break;
        } // end while
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
