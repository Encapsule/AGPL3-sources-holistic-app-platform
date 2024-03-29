// ControllerAction-app-client-kernel-step-worker.js

const holarchy = require("@encapsule/holarchy");
const cmasHolisticHTML5ServicePackage = require("../cmasHolisticHTML5ServicePackage");
const lib = require("./lib");

// This action is never expected to be called by an external actor.
// It is only ever expected to be dispatched in response to a process
// step transition in the holistic app client kernel cell process.
// In more detail, this "step worker" action is "called" by OPC._evaluate when
// it is transitioning the app client kernel process between steps that declare
// enter/exit actions that OPC has delegated to us across the action request bus.
// Here in this "step worker" action we define the actual runtime semantics of these
// APM-declared process model orchestrations (i.e. concrete runtime interactions,
// internal/externally-visible side-effects etc.)

const controllerAction = new holarchy.ControllerAction({

    id: "4zsKHGrWRPm9fFa-RxsBuw",
    name: "HolisticHTML5 App Client Kernel: Process Step Worker",
    description: "Performs actions on behalf of the HolisticHTML5Service_Kernel cell process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    kernel: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            stepWorker: {
                                ____types: "jsObject",
                                action: {
                                    ____accept: "jsString",
                                    ____inValueSet: [
                                        "noop",
                                        "activate-subprocesses",
                                        "deserialize-bootROM-data",
                                        "config-subprocesses",
                                        "activate-service-process",
                                    ],
                                    ____defaultValue: "noop"
                                }
                            }
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

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const actorName = `[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}]`;
            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.stepWorker;
            console.log(`${actorName} processing "${messageBody.action}" request on behalf of app client kernel process.`);

            let getStatusResponse  = lib.getStatus.request(request_.context);
            if (getStatusResponse.error) {
                errors.push(getStatusResponse.error);
                break;
            }
            const memoryDescriptor = getStatusResponse.result;
            const cellMemory = memoryDescriptor.cellMemory;
            let actResponse, ocdResponse;

            switch (messageBody.action) {
            case "noop":
                break;

                // ****************************************************************
                // ****************************************************************

            case "activate-subprocesses":

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating app-specialized HolisticServiceCore_Metadata process on behalf of HolisticHTML5Service_Kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.appMetadata",
                                    actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: "srjZAO8JQ2StYj07u_rgGg" /* "Holistic App Common Kernel: App Metadata Process" */ } } } }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath,  // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating app-specialized HolisticHTML5Service_DOMLocation process on behalf of HolisticHTML5Service_Kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.domLocationProcessor",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                processCoordinates: { apmID: cmasHolisticHTML5ServicePackage.mapLabels({ APM: "HolisticHTML5Service_DOMLocation" }).result.APMID  },
                                                activate: {
                                                    // v0.0.51-ametrine --- TODO: remove the derivedAppClientProcessCoordinates -- not needed w/ObservableValue
                                                    processData: {
                                                        derivedAppClientProcessCoordinates: cellMemory.derivedAppClientProcessCoordinates
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating app-specialized HolisticHTML5Service_DisplayAdapter process on behalf of HolisticHTML5Service_Kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.d2r2DisplayAdapter",
                                    actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: "IxoJ83u0TXmG7PLUYBvsyg" /* "Holistic Client App Kernel: d2r2/React Client Display Adaptor" */ } } } }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                break;

                // ****************************************************************
                // ****************************************************************

            case "deserialize-bootROM-data":
                try {
                    const bootROMElement = document.getElementById(cellMemory.bootROMElementID);
                    if (bootROMElement === null) {
                        errors.push(`Unexpected error in HolisticHTML5Service_Kernel process: Cannot locate DOM element '${kernelCelLData.bootROMElementID}' expected to contain the kernel's bootROM data.`);
                        break;
                    }
                    const bootDataString = bootROMElement.textContent;
                    const bootDataShouldBeBase64 = Buffer.from(bootDataString, 'base64'); // Should return new Buffer containing deserialized base64-encoded bootROM data in JSON format. Or, Buffer.from will throw a TypeError exception if this presumption is not met.
                    const bootDataShouldBeJSON = bootDataShouldBeBase64.toString("utf8"); // We expect this to be a JSON-encoded UTF-8 string. But, am only sure of that if we can actually deserialize it as JSON.
                    const bootROMShouldBeValidData = JSON.parse(bootDataShouldBeJSON); // If the UTF-8 string is not valid JSON, then JSON.parse will throw a SyntaxError exception.

                    // So now we have some in-memory data deserialized from JSON but have no idea what it is. Or, if it's valid.
                    // There are many levels of meaning to this data potentially. Here we do not have nearly enough context to make those
                    // decisions but do have the ability to write the deserialized bootROM data into the kernel process' OCD memory.
                    // Note that if the data is incorrect, corrupt, incomplete that it is likely to fail OCD memory filter.

                    ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.bootROMData" }, bootROMShouldBeValidData);
                    if (ocdResponse.error) {
                        errors.push("Unexpected internal error in HolisticHTML5Service_Kernel process: Service bootROM data is invalid or corrupt; we cannot start the service kernel due to error:");
                        errors.push(ocdResponse.error);
                    } else {
                        // Finally, if no errors remove the element from the DOM and free the heap occupied by the serialized copy that we have now deserialized into the kernel's cell memory.
                        bootROMElement.parentNode.removeChild(bootROMElement); // delete the DOM node
                    }

                } catch (exception_) {
                    errors.push("Unexpected exception caught during HolisticHTML5Service kernel bootROM deserialization:");
                    errors.push(exception_.toString());
                }
                break;


                // ****************************************************************
                // ****************************************************************

            case "config-subprocesses":

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Sending configuration data to the HolisticServiceCore_Metadata cell process to let it know if HTML5 document serialized by HolisticNodeService was rendered w/non-200 HTTP response code.",
                    actionRequest: {
                        holistic: {
                            app: {
                                metadata: {
                                    _private: {
                                        config: {
                                            pageMetadataOverride: {
                                                httpResponseDisposition: cellMemory.bootROMData.initialDisplayData.httpResponseDisposition,
                                                errorPageMetadata: cellMemory.bootROMData.initialDisplayData.pageMetadata
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: cellMemory.serviceProcesses.appMetadata.result.actionResult.apmBindingPath
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Sending configuration data to the HolistcHTML5Service_DOMLocation cell process to let it know if the HTML5 document serialized by HolisticNodeService was rendered w/non-200 HTPP response code.",
                    actionRequest: {
                        holistic: {
                            app: {
                                client: {
                                    domLocation: {
                                        _private: {
                                            configure: {
                                                httpResponseCode: cellMemory.bootROMData.initialDisplayData.httpResponseDisposition.code
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: cellMemory.serviceProcesses.domLocationProcessor.result.actionResult.apmBindingPath
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                // TODO 2022.02.22: Distill to one or two sentences. All this detail is superfluous. We're performing a client-side
                // React "rehydrate" operation of content that was rendered on the server. 


                // At this point the actual contents of the DOM visible to the user as the HolisticHTML5Service is booting
                // was rendered by HolisticNodeService in response to an HTTP GET request for an HTML5 document. If the HTTP
                // request was valid (i.e. accepted by HolisticNodeService) then the visible DOM contents will be a function
                // of information encoded in a holistic page metadata record corresponding to the HTTP request's URI
                // (e.g. GET:/ URI is '/', GET:/dashboard?x=1234 URI is '/dashboard'). If the request is invalid then the
                // visible contents of the DOM is likely some type of error page. We can determine which of these cases
                // by inspecting the HolisticNodeService's HTTP response code status to ensure it is identical to 200.
                // But, at this point in the HolisticHTML5Service boot process we actually do not care; the visible DOM content
                // is whatever it is. The DOM may or or may not contain HTML5 elements that expect/require programmatic functionality
                // from your HolisticHTML5Service instance. So, as a first order of business we simply re-render to the DOM
                // w/whatever was rendered by HolisticNodeService using info passed to us through the bootROM. Display adapter
                // takes care of the details but briefly is using ReactDOM.hydrate API to logically unsuspend the service's
                // display process (some number of React.Element instances managed by React VDOM) that were activated in
                // the context of an HTTP request handled by HolisticNodeService, subsequently serialized to HTML + data,
                // and here "unsuspended" (i.e. re-activated) from deep sleep (i.e. serialized form of a process).

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Sending initial layout request data to the app client display adapter to activate the display adapter process.",
                    actionRequest: {
                        holistic: {
                            app: {
                                client: {
                                    display: {
                                        _private: {
                                            activate: {
                                                windowLoadTimeMs: cellMemory.windowLoadTimeMs,
                                                displayLayoutRequest: {
                                                    renderData: cellMemory.bootROMData.initialDisplayData.renderData
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // HolisticHTML5Service_Kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                break;

                // ****************************************************************
                // ****************************************************************
            case "activate-service-process":

                setTimeout(function() {

                    actResponse = request_.context.act({
                        actorName,
                        actorTaskDescription: "HolisticHTML5Service_Kernel cell process will now attempt to activate the application service's main cell process...",
                        actionRequest: {
                            CellProcessor: {
                                util: {
                                    writeActionResponseToPath: {
                                        dataPath: "#.serviceProcesses.appServiceProcess",
                                        actionRequest: {
                                            CellProcessor: {
                                                process: {
                                                    processCoordinates: cellMemory.derivedAppClientProcessCoordinates,
                                                    activate: {
                                                        processData: {
                                                            activationMode: (cellMemory.bootROMData.initialDisplayData.httpResponseDisposition.code === 200)?"app-service-start":"app-service-error"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        apmBindingPath: request_.context.apmBindingPath // will be the holistic HTML5 service kernel process
                    });

                }, 300);

                /* not if we call async above...
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                */

                break;


            default:
                errors.push(`Internal error: unhandled action value "${messageBody.action}".`);
                break;
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;
