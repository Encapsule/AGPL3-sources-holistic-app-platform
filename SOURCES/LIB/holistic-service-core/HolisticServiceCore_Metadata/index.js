
const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "7007lG0iS4esk_zoF6GLhA",
        operationName: "Holistic Service Core App Metadata CellModel Factory",
        operationDescription: "Filter used to synthesize a specialized app metadata CellModel.",
        inputFilterSpec: {
            ____types: "jsObject",
            appBuild: {
                // Because lazy
                ____accept: "jsObject" // TODO make this explicit should be explicit
            },
            appTypes: {
                ____types: "jsObject",
                metadata: {
                    ____types: "jsObject",
                    specs: {
                        ____accept: "jsObject" // TODO make this explicit shoud be explicit
                    }
                }
            },
            appModels: {
                ____types: "jsObject",
                metadata: {
                    ____types: "jsObject",
                    accessors: {
                        ____accept: "jsObject"
                    }
                }
            }
        },
        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel class instance.
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const appBuild = request_.appBuild;
                const metadataTypes = request_.appTypes.metadata.specs;
                const metadataAccessors = request_.appModels.metadata.accessors;

                const cellModel = new holarchy.CellModel({
                    id: "-mApjtHVTE2UpIANFJGaPQ",
                    name: `${appBuild.app.name} Service Core App Metadata Model`,
                    description: `Provides a standard way for any cell to access app-defined static metadata values consistently across ${appBuild.app.name} HolisticNodeService and HolisticTabService instances.`,
                    apm: {
                        id: "srjZAO8JQ2StYj07u_rgGg",
                        name: `${appBuild.app.name} Service Core App Metadata Process`,
                        description: "Isn't really a process. Rather, it's an action to query metadata from any active cell consistently.",
                        // TODO: Look into removing this entirely. It will cause breaks in I don't want to deal with right now in tab service kernel. And, it's harmless to activate it and let it have a { __apmiStep: uninitialzed } value in OCD.
                    },
                    actions: [
                        {
                            id: "8KWW5zkCTMKRihNXKX_Pdw",
                            name: "Holistic App Common Kernel: Query App Metadata",
                            description: "Retrieves a copy of the derived application's application metadata.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        metadata: {
                                            ____types: "jsObject",
                                            query: {
                                                ____types: "jsObject",
                                                type: {
                                                    ____accept: "jsString",
                                                    ____inValueSet: [ "org", "app", "page", "hashroute", "digraph" ]
                                                },
                                                uri: {
                                                    ____accept: [ "jsNull" /* N/A (type is org or app) */, "jsString" ],
                                                    ____defaultValue: null
                                                }
                                            }
                                        }
                                    }
                                }
                            }, // actionRequestSpec
                            actionResultSpec: {
                                ____label: "App Metadata Query Result",
                                ____description: "App metadata query by type result descriptor object.",
                                ____accept: "jsObject" // The metadata descriptor object in the format specified by the developer's app metadata filter specs.
                            },
                            bodyFunction: function(request_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;

                                    const messageBody = request_.actionRequest.holistic.app.metadata.query;
                                    switch (messageBody.type) {
                                    case "org":
                                        response.result = metadataAccessors.getAppMetadataOrg();
                                        break;
                                    case "app":
                                        response.result = metadataAccessors.getAppMetadataApp();
                                        break;
                                    case "page":
                                        response.result = metadataAccessors.getAppMetadataPage(messageBody.uri);
                                        break;
                                    case "hashroute":
                                        response.result = metadataAccessors.getAppMetadataHashroute(messageBody.uri);
                                        break;
                                    case "digraph":
                                        response.result = metadataAccessors.getAppMetadataDigraph();
                                        break;
                                    default:
                                        errors.push(`Internal error: Unhandled query.type value "${messageBody.type}".`);
                                        break;
                                    } // switch
                                    if (errors.length) {
                                        break;
                                    }
                                    break;
                                }
                                if (errors.length) {
                                    response.error = errors.join(" ");
                                }
                                return response;
                            }

                        } // ControllerAction holistic.app.metadata.query
                    ]
                });
                if (!cellModel.isValid()) {
                    throw new Error(cellModel.toJSON());
                }
                response.result = cellModel;
                break;
            } // inBreakScope
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        } // bodyFunctoin
    }); // arccore.filter.create
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();
