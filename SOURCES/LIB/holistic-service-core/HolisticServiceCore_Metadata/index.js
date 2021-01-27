
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
                        ____accept: "jsObject" // TODO: lock this down? It's technically fine as we're passing through a filter spec as an opaque descriptor object here. No need to actually re-filter it.
                    }
                },
                bootROM: {
                    ____types: "jsObject",
                    spec: {
                        ____accept: "jsObject"  // TODO: lock this down? Same rationale for leaving it as-is as above.
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

                const pageMetadataOverrideSpec = {
                    ____types: [ "jsNull", "jsObject" ],
                    ____defaultValue: null,
                    httpResponseDisposition: request_.appTypes.bootROM.spec.initialDisplayData.httpResponseDisposition,
                    errorPageMetadata: request_.appTypes.bootROM.spec.initialDisplayData.pageMetadata
                };


                const cellModel = new holarchy.CellModel({
                    id: "-mApjtHVTE2UpIANFJGaPQ",
                    name: `${appBuild.app.name} HolisticServiceCore_Metadata Model`,
                    description: `Provides a standard way for any cell to access app-defined static metadata values consistently across ${appBuild.app.name} HolisticNodeService and HolisticTabService instances.`,
                    apm: {
                        id: "srjZAO8JQ2StYj07u_rgGg",
                        name: `${appBuild.app.name} HolisticServiceCore_Metadata Process`,
                        description: "Isn't really a process. Rather, it's an action to query metadata from any active cell consistently.",
                        // TODO: Look into removing this entirely. It will cause breaks in I don't want to deal with right now in tab service kernel. And, it's harmless to activate it and let it have a { __apmiStep: uninitialzed } value in OCD.

                        ocdDataSpec: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            pageMetadataOverride: pageMetadataOverrideSpec
                        }

                    },
                    actions: [
                        {
                            id: "maQuXnptRbill0zhL56-WA",
                            name: "HolisticServiceCore_Metadata Config",
                            description: "Configures the HolisticServiceCore_Metadata process w/post bootROM serialization data prior to calling the derived serice's start lifecycle action.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        metadata: {
                                            ____types: "jsObject",
                                            _private: {
                                                ____types: "jsObject",
                                                config: {
                                                    ____types: "jsObject",
                                                    pageMetadataOverride: pageMetadataOverrideSpec
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____accept: "jsUndefined" }, // no result
                            bodyFunction: function(request_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;
                                    const messageBody = request_.actionRequest.holistic.app.metadata._private.config;
                                    let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
                                    if (ocdResponse.error) {
                                        errors.push(ocdResponse.error);
                                        break;
                                    }
                                    const apmBindingPathSpec = ocdResponse.result;
                                    if (!apmBindingPathSpec.____appdsl || !apmBindingPathSpec.____appdsl.apm || (apmBindingPathSpec.____appdsl.apm !== "srjZAO8JQ2StYj07u_rgGg")) {
                                        errors.push(`Invalid apmBindingPath="${request_.context.apmBindingPath}" does not resolve to an active HolisticServiceCore_Metadata cell as expected.`);
                                        break;
                                    }
                                    ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.pageMetadataOverride" }, messageBody.pageMetadataOverride);
                                    if (ocdResponse.error) {
                                        errors.push(ocdResponse.error);
                                        break;
                                    }
                                    break;
                                }
                                if (errors.length) {
                                    response.error = errors.join(" ");
                                }
                                return response;
                            }
                        },


                        {
                            id: "8KWW5zkCTMKRihNXKX_Pdw",
                            name: "HolisticServiceCore_Metadata Query",
                            description: "Retrieves a copy of the service's org, app, page, or hashroute metadata.",
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
                                    let metadataResponse;

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
                                        if (!response.result) {
                                            errors.push(`No page metadata available for URI "${messageBody.uri}".`);
                                        }
                                        break;
                                    case "hashroute":
                                        response.result =  metadataAccessors.getAppMetadataHashroute(messageBody.uri);
                                        if (!response.result) {
                                            errors.push(`No page metadata available for URI "${messageBody.uri}".`);
                                        }
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

