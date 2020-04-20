// ocd-method-get-namespace-spec-filter.js

const arccore = require("@encapsule/arccore");
const ocdMethodPathSpec = require("./iospecs/ocd-method-path-spec");
const getNamespaceInReferenceFromPathFilter = require("./get-namespace-in-reference-from-path");

const factoryResponse = arccore.filter.create({
    operationID: "DD5Kc2KETyOPQ07hYu8n-w",
    operationName: "OCD.getNamespaceSpec Method Filter",
    operationDescription: "Implements ObservableControllerData::getNamespaceSpec method.",

    inputFilterSpec: {
        ____label: "OCD.getNamespaceSpec Request",
        ____types: "jsObject",
        ocdReference: {
            ____label: "OCD Instance Reference",
            ____description: "A reference to the calling OCD class instance.",
            ____opaque: true
        },
        path: ocdMethodPathSpec
    },

    outputFilterSpec: {
        ____label: "OCD.getNamespaceSpec Result",
        ____opaque: true // Result depends on the namespace's filter specification
    }, // outputFilterSpec

    bodyFunction: function(request_) {

        let response = { error: null };
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
        return response;
    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
