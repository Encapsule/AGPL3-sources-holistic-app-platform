// ocd-method-get-namespace-spec-filter.js

const arccore = require("@encapsule/arccore");
const ocdMethodPathSpec = require("./iospecs/ocd-method-path-spec");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

const factoryResponse = arccore.filter.create({
    operationID: "DD5Kc2KETyOPQ07hYu8n-w",
    operationName: "OCD::getNamespaceSpec Filter",
    operationDescription: "Implements ObservableControllerData::getNamespaceSpec method.",

    inputFilterSpec: {
        ____label: "OCD.getNamespaceSpec Request",
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
    },

    outputFilterSpec: {
        ____label: "OCD.getNamespaceSpec Result",
        ____accept: "jsObject" // Result depends on the namespace's filter specification
    }, // outputFilterSpec

    bodyFunction: function(request_) {
        let response = { error: null };
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
            const filterResponse = getNamespaceInReferenceFromPathFilter.request({ namespacePath: fqPath, specRef: request_.ocdReference._private.storeDataSpec });
            if (filterResponse.error) {
                errors.push(`Cannot resolve a namespace descriptor in filter specification for path '${fqPath}'.`);
                errors.push(filterResponse.error);
                break;
            } // if error
            response.result = filterResponse.result;
            break;
        }
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
