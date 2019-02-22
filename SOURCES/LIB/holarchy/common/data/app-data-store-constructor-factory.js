// sources/common/rainier-app-data-store/app-data-store-constructor-factory.js
//

const arccore = require('arccore');
const buildTag = require('../../../../../build/_build-tag');

const rainierAppDataStoreBaseSpec = require('../filter-specs/data/');

var factoryResponse = arccore.filter.create({
    operationID: "ghB7Smu_RxWZPN-Waf8B7w",
    operationName: "Application Data Store Constructor Factory",
    operationDescription: "Accepts the filter specification of the derived application's data store - an in-memory structure used as a source of truth for React components (readers).",
    inputFilterSpec: {
        ____label: "Application-Specific Data Store Filter Specification",
        ____description: "A filter specification object that schematizes the the `derived` namespace of the application data store object.",
        ____accept: "jsObject"
    },
    bodyFunction: function(request_) {
        var response = { error: null, response: null };
        var errors = [];
        var inBreakScope = false
        while (!inBreakScope) {
            inBreakScope = true;
            var appDataStoreSpec = arccore.util.clone(rainierAppDataStoreBaseSpec);
            appDataStoreSpec.derived = request_;

            // If this construction succeeds, then this is what we return to the module that imports/requires this module.
            // Subsequently, the dependent module calls this filter's `request` method to construct the actual application data store object.
            // This provides a way to merge schema provided by rainier-ux-base with schema provided by rainier-ux into a single document.
            // And, a means of keeping track of all the small contracts between the various readers (primarily React components), and writers
            // (primarily user input event handlers and XMLHttpRequest result handlers retrieving information from the Node.js server).

            var innerFactoryResponse = arccore.filter.create({
                operationID: "CSPLqKSqT_q6ILHTdZTd8g",
                operationName: "Aplication Data Store Constructor",
                operationDescription: "Constructs an in-memory data structure used to store application layer runtime state data.",
                inputFilterSpec: appDataStoreSpec
            });

            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    },
    outputFilterSpec: {
        ____label: "Application Data Store Constructor Filter",
        ____types: "jsObject",
        filterDescriptor: { ____accept: "jsObject" },
        request: { ____accept: "jsFunction" }
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
