// HolisticAppClientService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");
const d2r2 = require("@encapsule/d2r2");

const { HolisticServiceCore } = require("@encapsule/holistic-service-core");

const html5ServiceCellModelFactory = require("../../HolisticHTML5Service_Kernel");

const factoryResponse = arccore.filter.create({
    operationID: "Jrc6uiRXS-aCNcQEDNcTug",
    operationName: "HolisticHTML5Service::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticHTML5Service::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec:  require("./iospecs/HolisticHTML5Service-method-constructor-filter-input-spec"),
    outputFilterSpec: require("./iospecs/HolisticHTML5Service-method-constructor-filter-output-spec"),
    bodyFunction: function(request_) {
        console.log(`HolisticHTML5Service::constructor [${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}]`);
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const appServiceCore = (request_.appServiceCore instanceof HolisticServiceCore)?request_.appServiceCore:new HolisticServiceCore(request_.appServiceCore);

            const appBuild = appServiceCore.getAppBuild();

            const serviceBootROMSpec = appServiceCore.getServiceBootROMSpec();

            response.result = {
                serviceModel: null,
                serviceRuntime: null
            };

            // TODO: We need some stable ID's. I think these should come from appServiceCore? Yea - let's not fuck around...
            // The issue is that ultimately these keys underpin invariant assumptions we want to make about the location
            // of various cells in Node.js service cellplane and HTML5 service cellplane... More about this when there's more time...
            // TODO: Yea - 2nd thought the way I want to do it will take an hour that doesn't need to be done now
            // in order to get the current HTML5 service infrastructure dialed back online w/the re-integrated
            // v0.0.49-spectrolite Node.js service infrastructure.

            const html5ServiceCellModelID = arccore.identifier.irut.fromReference(`HolisticHTML5Service.CellModel_1sJqGmKgTPGvPnmce3mlHg_${appBuild.app.name}`).result; // whatever really so long as it's stable. Here the generated IRUT is stable on appBuild.app.name which is likely okay for most people (defined by developer in holistic-app.json manifest).
            const html5ServiceAPMID = arccore.identifier.irut.fromReference(`HolisticHTML5Service.APM_V8HWzGZPQRGXDCEtTpZAMg_${appBuild.app.name}`).result; // as above
            const html5ServiceCellProcessorID = arccore.identifier.irut.fromReference(`HolisticHTML5Service.CellProcessor_1CBI_pNOSoyZDXK4iX77PA_${appBuild.app.name}`).result; // as above

            // v0.0.49-spectrolite


            // Now, let's build a specialized HTML5 service kernel CellModel for this app service.
            let factoryResponse = html5ServiceCellModelFactory.request({
                appBuild,
                appTypes: {
                    bootROMSpec: serviceBootROMSpec
                },
                appModels: {
                    display: {
                        targetDOMElementID: appServiceCore.getTargetDOMElementID(),
                        d2r2Components: [
                            ...appServiceCore.getDisplayComponents(), // All d2r2 components registered for use in all derived holistic app service contexts (this is app-specific + holistic shared d2r2 components). Note, holistic does not currently contribute any Node.js specific d2r2 components. But, it's an implementation detail now.
                            ...request_.appModels.display.d2r2Components // All d2r2 components registered for use by the app service in the context of the Node.js service runtime
                        ]
                    }
                }
            });
            if (factoryResponse.error) {
                errors.push(`Unable to synthesize a HTML5 service kernel CellModel for use by ${appBuild.app.name} HTML5 service due to error:`);
                errors.push(factoryResponse.error);
                break;
            }

            const html5ServiceKernelCellModel = factoryResponse.result;

            // Now, let's go build the final HTML5 service CellModel that represents all the platform and app-specific behaviors required by the HTML5 service runtime.
            const html5ServiceCellModel = new holarchy.CellModel({ // CellModel declaration description object.

                id: html5ServiceCellModelID,
                name: `${appBuild.app.name} HTML5 Service Model (synthesized)`,
                description: `Synthesized HolisticHTML5Service runtime CellModel specialized for app service '${appBuild.app.name}'.`,
                apm: { // AbstractProcessModel declaration descriptor object
                    id: html5ServiceAPMID,
                    name: `${appBuild.app.name} HTML5 Service Process (synthesized)`,
                    description: `Synthesized HolisticHTML5Service runtime AbstractProcessModel for app service '${appBuild.app.name}'.`,
                    ocdDataSpec: {
                        ...request_.appModels.html5ServiceCell.apmDeclaration.ocdDataSpec,
                        activationMode: {
                            ____label: `${appBuild.app.name} Process Activation Mode`,
                            ____description: `A flag that indicates the activation mode of ${appBuild.app.name} derived service process.`,
                            ____accept: "jsString",
                            ____inValueSet: [
                                "app-service-start",
                                "app-service-error"
                            ]
                        }
                    }, // ocdDataSpec

                    steps: {
                        // Order matters here.

                        "app-service-start": {
                            description: "The derived app service process has been activated and is now interactive."
                        },

                        "app-service-error": {
                            description: "The dervied app service process has been activated but did not start correctly. And, is not interactive."
                        },

                        ...request_.appModels.html5ServiceCell.apmDeclaration.steps,

                        "uninitialized": {
                            description: "Default APM starting step.",
                            transitions: [ { transitionIf: { always: true}, nextStep: "app-service-boot" } ]
                        },

                        "app-service-boot": {
                            description: `${appBuild.app.name} process is booting.`,
                            transitions: [
                                {
                                    nextStep: "app-service-start",
                                    transitionIf: { holarchy: { cm: { operators: { ocd: { compare: { values: { a: { value: "app-service-start" }, b: { path: "#.activationMode" }, operator: "===" } } } } } } }
                                },
                                {
                                    nextStep: "app-service-error",
                                    transitionIf: { always: true }
                                }
                            ]
                        }

                    }
                }, // apm

                // TODO: We have work to do before we do this definition synthesis in order to pre-process the registration set.
                subcells: [
                    ...appServiceCore.getCellModels(), // All the CellModels aggregated by our HolisticServiceCore instance.
                    ...request_.appModels.cellModels, // All the CellModels registered by the developer via HolisticHTML5Service::constructor request.
                    html5ServiceKernelCellModel, // The synthesized HTML5 service kernel CellModel.
                    ...request_.appModels.html5ServiceCell.subcells
                ],

                actions: [
                    ...request_.appModels.html5ServiceCell.actions,
                    // ----------------------------------------------------------------
                    // ControllerAction: holistic.app.client.boot

                    {
                        id: arccore.identifier.irut.fromReference(`${html5ServiceCellModelID}::holistic.app.client.boot`).result,
                        name: `${appBuild.app.name} HTML5 Service Boot Action`,
                        description: `This action is called by HolisticHTML5Service.start method (typically in SOURCES/CLIENT/client.js) to boot the HTML5 service's re-activation sequence and bring it out of its suspended state as an lifeless HTML5 document.`,
                        actionRequestSpec: {
                            ____types: "jsObject",
                            holistic: {
                                ____types: "jsObject",
                                app: {
                                    ____types: "jsObject",
                                    client: {
                                        ____types: "jsObject",
                                        boot: {
                                            ____types: "jsObject"
                                        }
                                    }
                                }
                            }
                        },
                        actionResultSpec: { ____opaque: true /* TODO - if not going to extend then lets accept nothing and be clear about it? */ },
                        bodyFunction: function(controllerActionRequest_) {
                            let response = { error: null };
                            let errors = [];
                            let inBreakScope = false;
                            while (!inBreakScope) {
                                inBreakScope = true;

                                const actorName = `${appBuild.app.name} App Client Launcher`;

                                let actResponse = controllerActionRequest_.context.act({
                                    actorName,
                                    actorTaskDescription: `Attempting to launch the Holistic App Client Kernel process on behalf of derived application '${appBuild.app.name}'.`,
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                processCoordinates: { apmID: "PPL45jw5RDWSMNsB97WIWg" /* Holistic App Client Kernel */ },
                                                activate: {
                                                    processData: {
                                                        derivedAppClientProcessCoordinates: { apmID: html5ServiceAPMID }
                                                    }
                                                },
                                            }
                                        }
                                    },
                                    apmBindingPath: "~"
                                });
                                if (actResponse.error) {
                                    errors.push(actResponse.error);
                                    break;
                                }
                                const appClientKernelActivateResult = actResponse.result;

                                /*
                                actResponse = controllerActionRequest_.context.act({
                                    actorName,
                                    actorTaskDescription: `Attempting to launch derived application '${appBuild.app.name}' process.`,
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                processCoordinates: {
                                                    apmID: html5ServiceAPMID // X HTML5 service APM ID (synthesized)
                                                },
                                                activate: {
                                                    processData: {
                                                        appClientRuntime: undefined // v0.0.49-spectrolite --- take the default here for now and let html5Service APM sort it out in its OCD spec.
                                                    }
                                                },
                                            }
                                        }
                                    },
                                    apmBindingPath: "~"
                                });
                                if (actResponse.error) {
                                    errors.push(actResponse.error);
                                    break;
                                }
                                */

                                break;
                            }
                            if (errors.length) {
                                response.error = errors.join(" ");
                            }
                            return response;
                        }
                    },

                    // ----------------------------------------------------------------
                    // I THINK WE WILL DEPRECATE THIS TOO!!!!
                    // ControllerAction: holistic.app.client.lifecycle.hashroute
                    {
                        id: arccore.identifier.irut.fromReference(`${html5ServiceCellModelID}::holistic.app.client.lifecycle.hashroute`).result,
                        name: `${appBuild.app.name} App Client Lifecycle Action: Hashroute`,
                        description: `This action is invoked by the HTML5 service kernel to inform ${appBuild.app.name} service logic that a hash change event has been fired by the DOM indicating a user modification (via their browser e.g. forward/back/manual/bookmark/link) or programmatic (via window.replace/window.location=) update of current HTML5 service routing info.`,
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
                                            hashroute: {
                                                ____label: "DOM Location Router Event Descriptor",
                                                ____description: "A descriptor object containing information about the hashroute change event created by the DOMLocationProcessor.",
                                                ____types: "jsObject",
                                                actor: {
                                                    ____label: "Event Source Actor",
                                                    ____description: "A string enumeration value indicating the actor that caused the hashroute change event to occur.",
                                                    ____accept: "jsString",
                                                    ____inValueSet: [
                                                        // TODO: There is a small set of potential actors that may trigger a hashroute change event.
                                                        // It's useful probably to report them accurately. Currently, it's half-baked and of little
                                                        // more use than the counter value.
                                                        "user", // the hashroute change event was triggered by user interaction with the browser.
                                                        "server", // the hashroute change event was triggered by app client kernel (this is an old label with a bad name).
                                                        "app", // ? Not sure
                                                    ]
                                                },
                                                hrefParse: {
                                                    ____accept: "jsObject" // TODO - note that this is a common schema to be deduced from the urlParse library implementation and shared as needed in platform code
                                                },
                                                hashrouteString: {
                                                    ____label: "Hashroute String",
                                                    ____description: "The unparsed hashroute string extracted from the current location.href value. Note that there are no official parsing rules for hashroute strings. We impose some predictable guiderails.",
                                                    ____accept: [ "jsNull", "jsString" ]
                                                },
                                                hashrouteParse: {
                                                    ____label: "Hashroute Parse Descriptor",
                                                    ____description: "The hashroute string parsed into a descriptor that includes unparsed search and query subproperties.",
                                                    ____types: [ "jsNull", "jsObject" ],
                                                    pathname: {
                                                        ____label: "Hashroute Pathname",
                                                        ____description: "The hashroute pathname should be used as the a stable primary key for querying app metadata; it does not include any URL-encoded query parameter information.",
                                                        ____accept: "jsString"
                                                    },
                                                    path: {
                                                        ____label: "Hashroute Path",
                                                        ____description: "The hashroute path is is similar to the pathname except that it contains the URL-encoded query parameter(s) if they're present in hashrouteString.",
                                                        ____accept: "jsString"
                                                    },
                                                    search: {
                                                        ____label: "Unparsed Search Parameters",
                                                        ____accept: [ "jsNull", "jsString" ]
                                                    },
                                                    query: {
                                                        ____label: "Unparsed Query Parameters",
                                                        ____accept: [ "jsNull", "jsString" ]
                                                    }
                                                },
                                                hashrouteQueryParse: {
                                                    ____label: "Hashroute Query Parse Descriptor",
                                                    ____accept: [ "jsNull", "jsObject" /*TODO*/ ]
                                                },
                                                routerEventNumber: {
                                                    ____accept: "jsNumber"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        actionResultSpec: { ____opaque: true /*TODO*/ },
                        bodyFunction: request_.appModels.html5ServiceCell.lifecycle.hashrouteFunction
                    },
                    // ----------------------------------------------------------------
                    // ControllerAction: holistic.app.client.lifecycle.error
                    {
                        id: arccore.identifier.irut.fromReference(`${html5ServiceCellModelID}::holistic.app.client.lifecycle.error`).result,
                        name: `${appBuild.app.name} App Client Lifecycle Action: Error`,
                        description: `This action is invoked by the HTML5 service kernel to inform ${appBuild.app.name} service logic that one or more unrecoverable runtime cellplane evaluation faults (errors) have occurred.`,
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
                                                ____types: "jsObject",
                                                lifecyclePhase: {
                                                    ____accept: "jsString",
                                                    ____inValueSet: [
                                                        // Whatever error is indicated by badResponse is fatal; the app client service process cannot be started.
                                                        "app-client-boot",
                                                        // Whatever error is indicated by badResponse is considered anomalous by the app client kernel
                                                        // and is likely an indication of a fatal application-level error (and likely active cells
                                                        // that are no longer being evaluated due to evaluation error(s)). But, we just pass this along
                                                        // here and keep the app client kernel and all other subsystems active.
                                                        "app-client-runtime",
                                                    ]
                                                },
                                                kernelProcessStep: { ____accept: "jsString" },
                                                errorType: {
                                                    ____accept: "jsString",
                                                    ____inValueSet: [
                                                        // An unhandled/unexpected error occurred when an external actor called CellProcessor.act.
                                                        // Or, a closure scope inside of a ControllerAction calls OPC.act in an async callback.
                                                        "action-error",
                                                        // An unhandled/unexpected error occurred during OPC._evaluate cell plane evaluation that
                                                        // was undertaken in response to some external actor request to CellProcessor.act/OPC.act.
                                                        "evaluation-error"
                                                    ]
                                                },
                                                badResponse: { ____accept: "jsObject" }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        actionResultSpec: {
                            ____accept: "jsString",
                            ____defaultValue: "okay"
                        },
                        bodyFunction: request_.appModels.html5ServiceCell.lifecycle.errorFunction
                    }

                ],

                operators: [
                    ...request_.appModels.html5ServiceCell.operators
                ]

            }); // new CellModel

            if (!html5ServiceCellModel.isValid()) {
                errors.push(`Unable to synthesize the ${appBuild.app.name} HTML5 service's main @encapsule/holarchy CellModel due to error:`);
                errors.push(html5ServiceCellModel.toJSON());
                break;
            }

            response.result.serviceModel = html5ServiceCellModel;

            // And, finally... Load the service cell model into a new CellProcessor instance
            // and let the cell process manager initialize.

            const html5ServiceRuntime = new holarchy.CellProcessor({
                id: html5ServiceCellProcessorID,
                name: appBuild.app.name,
                description: `${appBuild.app.name} HTML5 Service Runtime`,
                cellmodel: html5ServiceCellModel
            });

            if (!html5ServiceRuntime.isValid()) {
                errors.push(`Unable to initialize the ${appBuild.app.name} HTML5 service's @encapsule/holarchy CellProcessor runtime host due to error:`);
                errors.push(html5ServiceRuntime.toJSON());
                break;
            }

            response.result.serviceRuntime = html5ServiceRuntime;

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
