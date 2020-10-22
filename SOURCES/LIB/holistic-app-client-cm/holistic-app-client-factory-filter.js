// holistic-app-client-factory-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const filterDeclaration = {
        operationID: "xyEnAFgRRIKHUbjYXfzGyQ",
        operationName: "Holistic App Client CellModel Factory",
        operationDescription: "Constructs a CellModel that encapsulates a custom HTML5 client application derived from core services provided by this and @encapsule/holarchy RTL packages.",

        inputFilterSpec: {
            ____label: "Holistic App Client CellModel Factory Request",
            ____description: "A descriptor object that declares the configuration and defines the runtime details of a class HTML5 client application service derived from @encapsule/holistic-app-client-cm and @encapsule/holarchy RTL package services.",
            ____types: "jsObject",

            appBuildMetadata: { ____accept: "jsObject" },

            name: {
                ____label: "Client Application Name",
                ____description: "The client application name string should be taken (generally) from holistic platform Makefile-generated app-build.json app.name value. Client is implied by context; don't include that in the name.",
                ____accept: "jsString"
            },
            description: {
                ____label: "Client Application Description",
                ____description: "The client application description string should be taken (generally) from holistic platform Makefile-generated app-build.json app.description value. Client is implied by context; don't include that detail in the description.",
                ____accept: "jsString"
            },
            cellModelID: {
                ____label: "Client Application CellModel ID",
                ____description: "A developer-defined IRUT-format string to be used as the CellModel ID for the new CellModel synthesized by this factory filter.",
                ____accept: "jsString"
            },
            apmID: {
                ____label: "Client Application AbstractProcessModel ID",
                ____description: "A developer-defined IRUT-format string to be used as the AbstractProcessModel ID for the APM synthesized by this factory filter.",
                ____accept: "jsString"
            },

            appClientKernelIntegrations: {
                ____label: "Application Client Kernel Integrations",
                ____description: "A descriptor object used to define application-specific behaviors required by the @encapsule/holistic-app-client-cm RTL-provided HolisticAppClientKernel APM.",
                ____types: "jsObject",
                ____defaultValue: {},

                // Note that you provide the bodyFunction's. But, the input and output filter specifications for the synthesized ControllerAction plug-ins inferred here
                // are set and controlled by this factory (as they are closely-coupled to @encapsule/holistic-app-client-cm HolisticAppClientKernel CellModel and its submodels).

                appClientInitialize: {
                    ____label: "Application Client Init Function",
                    ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.init ControllerAction plug-in.",
                    ____accept: "jsFunction",
                    ____defaultValue: function(request_) {
                        console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}].appClientInit (default implementation).`);
                        return { error: null };
                    }
                },

                appClientQuery: {
                    ____label: "Application Client Query Function",
                    ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.query ControllerAction plug-in.",
                    ____accept: "jsFunction",
                    ____defaultValue: function(request_) {
                        console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}].appClientQuery (default implementation).`);
                        return { error: null };
                    }
                },

                appClientDeserialize: {
                    ____label: "Application Client Deserialize Function",
                    ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.deserialize ControllerAction plug-in.",
                    ____accept: "jsFunction",
                    ____defaultValue: function(request_) {
                        console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}].appClientDeserialize (default implementation).`);
                        return { error: null };
                    }
                },

                appClientStart: {
                    ____label: "Application Client Start Function",
                    ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.start ControllerAction plug-in.",
                    ____accept: "jsFunction",
                    ____defaultValue: function(request_) {
                        console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}].appClientDeserialize (default implementation).`);
                        return { error: null };
                    }
                }
            },

            appClientCellModels: {
                ____label: "Client Application CellModels",
                ____description: "An array of application-defined CellModel artifacts to be included in the synthesized app client CellModel.",
                ____types: "jsArray",
                ____defaultValue: [],
                cellModel: {
                    ____label: "Client Application CellModel Registration",
                    ____description: "A reference to a client application-specific CellModel to be included in the synthesized app client CellModel.",
                    ____accept: "jsObject"
                }
            }


        },



        outputFilterSpec: {
            ____label: "Holistic App Client CellModel",
            ____description: "Pass this CellModel to CellProcessor constructor function and then activate a cell process with the APM ID you specified to start the HTML5 client application service.",
            ____accept: "jsObject"
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const request = request_;

                const appClientCellModel = new holarchy.CellModel({ // CellModel declaration description object.

                    id: request.cellModelID,
                    name: `${request.name} CellModel (synthesized)`,
                    description: `Model description: ${request.description}`,

                    apm: { // AbstractProcessModel declaration descriptor object

                        id: request.apmID,
                        name: `${request.name} AbtractProcessModel (synthesized)`,
                        description: `Process description: ${request.description}`,

                        ocdDataSpec: {
                            ____label: `${request.name} Process Memory`,
                            ____description: `ObservableControllerData specification for APM ID '${request.apmID}'.`,
                            ____types: "jsObject",
                            ____defaultValue: {},

                            appBuildMetdata: { ____accept: "jsObject", ____defaultValue: request.appBuildMetadata },

                            appMetadataProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            },

                            appClientKernelProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            },

                            appDisplayAdaptorProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            },

                            appDOMLocationAdaptorProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            },

                            appServerAdaptorProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            },

                            appWebworkerAdaptorProcessProxy: {
                                ____types: "jsObject",
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ }
                            }


                        }, // ocdDataSpec

                        steps: {

                            uninitialized: {
                                description: "Default APM starting step.",
                                transitions: [
                                    { transitionIf: { always: true }, nextStep: "start_app_client_kernel_process" }
                                ]
                            },

                            start_app_client_kernel_process: {
                                description: "Attempting to start the Holistic App Client Kernel process.",
                                actions: {
                                    enter: [
                                        { CellProcessor: { process: { processCoordinates: { apmID: "PPL45jw5RDWSMNsB97WIWg", instanceName: "daemon" }, activate: { processData: { appBuildMetadata: request.appBuildMetadata } } } } }
                                    ]
                                },
                                transitions: [
                                    { transitionIf: { always: true }, nextStep: "wait_app_client_kernel_process" }
                                ]
                            },

                            wait_app_client_kernel_process: {
                                description: "Waiting for the Holistic App Client Kernel process."
                            }

                        }

                    }, // apm

                    subcells: [
                        ...request.appClientCellModels,
                        require("./HolisticAppClientKernel")
                    ]

                });

                if (!appClientCellModel.isValid()) {
                    errors.push(appClientCellModel.toJSON());
                    break;
                }

                response.result = appClientCellModel;


                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    };

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;

})();
