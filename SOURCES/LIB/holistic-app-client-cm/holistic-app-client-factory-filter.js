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

                lifecycleSignalActions: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    initFunction: {
                        ____label: "Application Client Lifecyle Signal Action: Initialize",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.init ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: No holistic.app.client.lifecycle.init signal action was registered. USING DEFAULT HANDLER (does nothing).`);
                            return { error: null };
                        }
                    },
                    queryFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Query",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.query ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: No holistic.app.client.lifecycle.query signal action was registered. USING DEFAULT HANDLER (does nothing).`);
                            return { error: null };
                        }
                    },
                    deserializeFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Deserialize",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.deserialize ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: No holistic.app.client.lifecycle.deserialize signal action was registered. USING DEFAULT HANDLER (does nothing).`);
                            return { error: null };
                        }
                    },
                    configFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Config",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.config ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: No holistic.app.client.lifecycle.config signal action was registered. USING DEFAULT HANDLER (does nothing).`);
                            return { error: null };
                        }
                    },
                    startFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Start",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.start ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: No holistic.app.client.lifecycle.start signal action registered. USING DEFAULT HANDLER (does nothing).`);
                            return { error: null };
                        }
                    },
                    errorFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Error",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.error ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] WARNING: holistic.app.client.lifecycle.error signal action registerd. USING DEFAULT HANDLER (overrides client app display to show error(s)).`);
                            return { error: null };
                        }
                    }
                }
            },

            appClientRuntimeSpec: { ____accept: "jsObject", ____defaultValue: { ____accept: "jsObject", ____defaultValue: {} } },
            appClientRuntimeProcessData: { ____accept: "jsObject", ____defaultValue: {} },

            appClientCellModelLibrary: {
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

        bodyFunction: function(clientFactoryRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const appClientCellModel = new holarchy.CellModel({ // CellModel declaration description object.
                    id: clientFactoryRequest_.cellModelID,
                    name: `${clientFactoryRequest_.name} App Client (synthesized)`,
                    description: `Synthesized holistic app client runtime CellModel for derived application '${clientFactoryRequest_.name}'.`,
                    apm: { // AbstractProcessModel declaration descriptor object
                        id: clientFactoryRequest_.apmID,
                        name: `${clientFactoryRequest_.name} App Client Runtime (synthesized)`,
                        description: `Synthesized holistic app client runtime AbstractProcessModel for derived application '${clientFactoryRequest_.name}'.`,
                        ocdDataSpec: {
                            ____label: `${clientFactoryRequest_.name} App Client Process Memory`,
                            ____description: `ObservableControllerData specification for APM ID '${clientFactoryRequest_.apmID}'.`,
                            ____types: "jsObject",
                            ____defaultValue: {},
                            kernelProxy: { ____types: "jsObject", ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ } },
                            locationProxy: {  ____types: "jsObject", ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ } },
                            displayProxy: {  ____types: "jsObject", ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell proxy APM */ } },
                            appClientRuntime: { ...clientFactoryRequest_.appClientRuntimeSpec }
                        }, // ocdDataSpec

                        steps: {
                            uninitialized: {
                                description: "Default APM starting step.",
                                transitions: [ { transitionIf: { always: true }, nextStep: "app-client-boot" } ]
                            },
                            "app-client-boot": {
                                description: "App client process is booting.",
                                transitions: [
                                    {
                                        transitionIf: {
                                            CellProcessor: {
                                                proxy: {
                                                    proxyCoordinates: "#.kernelProxy",
                                                    connect: {
                                                        statusIs: "connected"
                                                    }
                                                }
                                            }
                                        },
                                        nextStep: "app-client-kernel-connected"
                                    }
                                ]
                            },
                            "app-client-kernel-connected": {
                                description: "Our local proxy to the app client kernel process has been connected."
                            }

                        }
                    }, // apm
                    subcells: [ ...clientFactoryRequest_.appClientCellModelLibrary, require("./HolisticAppClientKernel") ],
                    actions: [

                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.start
                        // Call this action from outside CellProcessor in the client.js module to start the derived app client process.
                        // clientAppCellProcessor.act({ actorName: "bootstrap", actorTaskDescription: "start the show...", actionRequest: { holistic: { app: { client: { start: {} } } } } });
                        {
                            id: arccore.identifier.irut.fromReference(`${clientFactoryRequest_.cellModelID}::holistic.app.client.start`).result,
                            name: `${clientFactoryRequest_.name} App Client Process Boot Action`,
                            description: `This action is called by the client.js bootstrap function to activate the ${clientFactoryRequest_.name} App Client cell process inside CellProcessor.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            boot: {
                                                ____types: "jsObject" // TODO? Options?
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /* TODO */ },
                            bodyFunction: function(controllerActionRequest_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;

                                    const actorName = `${clientFactoryRequest_.name} App Client Launcher`;

                                    let actResponse = controllerActionRequest_.context.act({
                                        actorName,
                                        actorTaskDescription: `Attempting to launch the Holistic App Client Kernel process on behalf of derived application '${clientFactoryRequest_.name}'.`,
                                        actionRequest: {
                                            CellProcessor: {
                                                process: {
                                                    processCoordinates: {
                                                        apmID: "PPL45jw5RDWSMNsB97WIWg" /* Holistic App Client Kernel */,
                                                        instanceName: "daemon"
                                                    },
                                                    activate: {
                                                        processData: {
                                                            _private: {
                                                                derivedAppClientProcessCoordinates: {
                                                                    apmID: clientFactoryRequest_.apmID,
                                                                    instanceName: "daemon"
                                                                }
                                                            }
                                                        }
                                                    },
                                                }
                                            }
                                        }
                                    });
                                    if (actResponse.error) {
                                        errors.push(actResponse.error);
                                        break;
                                    }
                                    const appClientKernelActivateResult = actResponse.result;

                                    actResponse = controllerActionRequest_.context.act({
                                        actorName,
                                        actorTaskDescription: `Attempting to launch derived application '${clientFactoryRequest_.name}' process.`,
                                        actionRequest: {
                                            CellProcessor: {
                                                process: {
                                                    processCoordinates: {
                                                        apmID: clientFactoryRequest_.apmID, // X App Client (synthesized)
                                                        instanceName: "daemon"
                                                    },
                                                    activate: {
                                                        processData: {
                                                            appClientRuntime: clientFactoryRequest_.appClientRuntimeProcessData
                                                        }
                                                    },
                                                }
                                            }
                                        }
                                    });
                                    if (actResponse.error) {
                                        errors.push(actResponse.error);
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


                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.init
                        {
                            id: arccore.identifier.irut.fromReference(`${clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.init`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Init`,
                            description: `This action is dispatched by the Holistic App Client Kernel cell process to give the ${clientFactoryRequest_.name} app client cell process an opportunity to configure/initialize any library and/or runtime code that is **EXTERNAL-ONLY** to this CellProcessor instance.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                init: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____accept: "jsUndefined" }, // The app client kernel does not care what the app client runtime does inside of its lifecycle init action.
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.initFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.query
                        {
                            id: arccore.identifier.irut.fromReference(`{clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.query`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Query`,
                            description: `This action is dispatched by the Holistic App Client Kernel cell process to query the ${clientFactoryRequest_.name} derived app client process for its requirements and capabilities.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                query: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: {
                                ____label: "Holistic App Client Runtime Query Result",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                d2r2ComponentsArray: {
                                    ____label: "Application-Defined d2r2 Components Array",
                                    ____types: "jsArray",
                                    ____defaultValue: [],
                                    d2r2Component: { ____accept: "jsObject" }
                                }
                            },
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.queryFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.deserialize
                        {
                            id: arccore.identifier.irut.fromReference(`{clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.deserialize`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Deserialize`,
                            description: `This action is dispatched by the Holistic App Client Kernel cell process to give the ${clientFactoryRequest_.name} app client a copy of the document's bootROM data. And, to obtain from ${clientFactoryRequest_.name} app client an application-specific appBootROM object to be subsequently passed back to the config lifecycle action.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                deserialize: {
                                                    ____types: "jsObject",
                                                    bootROMData: { ____accept: "jsObject" } // TODO: We will want to schematize this object when we bring holistic app server kernel online.
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: {
                                ____label: "Holistic App Client Runtime Deserialize Result",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                appBootROMData: {
                                    ____description: "An opaque, application-defined object returned by the derived app client runtime process in response to the deserialize lifecycle event. This object is passed back to the derived app client runtime process via action request during subsequent kernel dispatch of the config lifecycle action.",
                                    ____accept: "jsObject",
                                    ____defaultValue: {}
                                }
                            },
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.deserializeFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.config
                        {
                            id: arccore.identifier.irut.fromReference(`{clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.config`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Config`,
                            description: `This action is invoked by the Holistic App Client Kernel process to inform the ${clientFactoryRequest_.name} app client process to configure itself and perform final preparation before the kernel dispatches the start lifecycle action.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                config: {
                                                    ____types: "jsObject",
                                                    appInitialClientRoute: { ____opaque: true }, // TODO: not even sure I want/need this yet.
                                                    appBootROMData: { ____accept: "jsObject" },
                                                    appRuntimeServiceProcesses: {
                                                        ____types: "jsObject",
                                                        appClientKernelProcessID: { ____accept: "jsString" },
                                                        d2r2DisplayAdapterProcessID: { ____accept: "jsString" },
                                                        domLocationProcessorProcessID: { ____accept: "jsString" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____accept: "jsUndefined" /*currently we take nothing back*/},
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.configFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.start
                        {
                            id: arccore.identifier.irut.fromReference(`{clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.start`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Start`,
                            description: `This action is invoked by the Holistic App Client Kernel process to inform the ${clientFactoryRequest_.name} app client process that the app client bootstrap process has completed, all app client kernel services are configured and ready, and that the visible DOM display surface is interactive.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                start: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.startFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.error
                        {
                            id: arccore.identifier.irut.fromReference(`{clientFactoryRequest_.cellModelID}::holistic.app.client.lifecycle.error`).result,
                            name: `${clientFactoryRequest_.name} App Client Lifecycle Action: Error`,
                            description: `This action is invoked by the Holistic App Client Kernel process to inform the ${clientFactoryRequest_.name} app client process of the occurance of runtime cell plane evaluation errors.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                error: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: clientFactoryRequest_.appClientKernelIntegrations.lifecycleSignalActions.errorFunction
                        }

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