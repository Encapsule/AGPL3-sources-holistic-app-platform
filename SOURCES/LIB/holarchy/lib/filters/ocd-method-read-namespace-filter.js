// ocd-method-read-namespace-filter.js

const arccore = require("@encapsule/arccore");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");
const ocdMethodPathSpec = require("./iospecs/ocd-method-path-spec");

const factoryResponse = arccore.filter.create({
    operationID: "wjTFsXoyQ_ehUHIdegBumQ",
    operationName: "OCD.readNamespace Method Filter",
    operationDescription: "Implements ObservableControllerData::readNamespace method.",

    inputFilterSpec: {
        ____label: "OCD Read Namespace Request",
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
        path: ocdMethodPathSpec
    }, // inputFilterSpec

    outputFilterSpec: {
        ____label: "OCD Read Namepace Result",
        ____opaque: true // Result depends on the namespace's filter specification
    }, // outputFilterSpec

    bodyFunction: function(request_) {
        let response = { error: null, result: undefined };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {

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
            if (!request_.ocdReference._private.accessFilters.read[fqPath]) {
                // Cache miss. Create a new read filter for the requested namespace.
                const operationId = arccore.identifier.irut.fromReference("read-filter" + fqPath).result;
                let filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: fqPath, sourceRef: request_.ocdReference._private.storeDataSpec, parseFilterSpec: true });
                if (filterResponse.error || !filterResponse.result) {
                    errors.push(`Cannot read controller data store namespace path '${fqPath}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                const targetNamespaceSpec = filterResponse.result;
                filterResponse = arccore.filter.create({
                    operationID: operationId,
                    operationName: `Controller Data Read Filter ${operationId}`,
                    operationDescription: `Validated/normalized read operations from OCD namespace '${fqPath}'.`,
                    bodyFunction: () => { return getNamespaceInReferenceFromPathFilter.request({ namespacePath: fqPath, sourceRef: request_.ocdReference._private.storeData }); },
                    outputFilterSpec: targetNamespaceSpec,
                });
                if (filterResponse.error) {
                    errors.push(`Cannot read controller data store namespace path '${fqPath}' because it is not possible to construct a read filter for this namespace.`);
                    errors.push(filterResponse.error);
                    break;
                } // if error
                // Cache the newly-created read filter.
                request_.ocdReference._private.accessFilters.read[fqPath] = filterResponse.result;
            } // if read filter doesn't exist
            const readFilter = request_.ocdReference._private.accessFilters.read[fqPath];
            response = readFilter.request();
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
