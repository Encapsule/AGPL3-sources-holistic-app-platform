// sources/common/data/app-data-store-write-filter-factory.js

const arccore = require("arccore");
const getNamespaceInReferenceFromPath = require("./get-namespace-in-reference-from-path");

var factoryResponse = arccore.filter.create({
    operationID: "fOBf1kBTSLOatLtRA54TUw",
    operationName: "App Data Store Write Filter Factory",
    operationDescription: "Responsible for constructing an app data store write filter.",

    inputFilterSpec: {
        ____label: "App Data Store Writer Filter Factory Request",
        ____types: "jsObject",

        appDataStoreFilterSpec: {
            ____label: "Application State Data Store Filter Specification",
            ____description: "A reference to the app data store's master filter specification.",
            ____accept: "jsObject"
        },

        id: {
            ____label: "Write Filter Operation ID",
            ____description: "The 22-character IRUT identifier to be used for the generated app data store write filter.",
            ____accept: "jsString"
        },

        stateNamespacePath: {
            ____label: "State Namespace Path",
            ____description: "A dot-delimited ARCcore.filter-format namespace path specification path beginngin with ~.",
            ____accept: "jsString"
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            if (!request_.stateNamespacePath.length) {
                errors.push("Invalid zero-length stateNamespacePath value specified.");
                break;
            }

            if (!request_.stateNamespacePath.startsWith("~")) {
                errors.push("Invalid stateNamespacePath value must be a dot-delimited ARCcore.filter namespace path beginning in `~`.");
                break;
            }

            // Retrieve the filter specification node from the application data store constructor filter.

            var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: request_.stateNamespacePath,
                sourceRef: request_.appDataStoreFilterSpec
            });

            if (innerResponse.error) {
                errors.push("Unable to retrieve a filter specification node for path '" + request_.namespacePath + "' due a fatal error:");
                errors.push(innerResponse.error);
                break;
            }

            var targetFilterSpec = innerResponse.result;

            if (!targetFilterSpec || !(targetFilterSpec.____types || targetFilterSpec.____accept || targetFilterSpec.____opaque)) {
                errors.push("Invalid or undefined app data store namespace path '" + request_.namespacePath + "'.");
                break;
            }

            // CREATE THE APP DATA STORE WRITE FILTER.
            var createWriteFilter = function() {
                const stateNamespacePath = request_.stateNamespacePath;
                var stateNamespaceTokens = stateNamespacePath.split(".");
                var targetNamespaceName = stateNamespaceTokens.pop();
                var parentStateNamespacePath = stateNamespaceTokens.join(".");

                return arccore.filter.create({
                    operationID: request_.id,
                    operationName: "App Data Store Write Filter",
                    operationDescription: "Performs a filtered write operation to a pre-designated namespace in the app data store.",
                    inputFilterSpec: {
                        ____label: "App Data Store Write Request",
                        ____description: "Request to write data into a pre-designated state namespace in the app data store.",
                        ____types: "jsObject",
                        appDataStore: {
                            ____label: "App Data Store",
                            ____description: "A reference to the app data store singleton object to write.",
                            ____accept: "jsObject"
                        },
                        writeData: targetFilterSpec
                    },
                    bodyFunction: function(request_) {
                        var response = { error: null, result: null };
                        var errors = [];
                        var inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;

                            console.log([ "STATE WRITE >>> ", this.operationID, "::", this.operationName, " '", stateNamespacePath, "'"].join(""));

                            var innerResponse = getNamespaceInReferenceFromPath.request({
                                namespacePath: parentStateNamespacePath,
                                sourceRef: request_.appDataStore
                            });
                            if (innerResponse.error) {
                                errors.push(innerResponse.error);
                                break;
                            }
                            var parentNamespace = innerResponse.result;
                            parentNamespace[targetNamespaceName] = request_.writeData;
                            response.result = request_.writeData;
                            break;
                        }
                        if (errors.length)
                            response.error = errors.join(" ");
                        return response;
                    } // bodyFunction
                });
            }; // end function createWriteFilter

            innerResponse = createWriteFilter();

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            response.result = innerResponse.result;
            break;

        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    },

    outputFilterSpec: {
        ____label: "App Data Store Write Filter",
        ____accept: "jsObject"
    }

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
