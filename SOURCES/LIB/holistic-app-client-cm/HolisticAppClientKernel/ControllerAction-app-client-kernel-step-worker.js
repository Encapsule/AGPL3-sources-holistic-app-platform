// ControllerAction-app-client-kernel-step-worker.js

const holarchy = require("@encapsule/holarchy");
const hackLib = require("./lib");

const controllerAction = new holarchy.ControllerAction({

    id: "4zsKHGrWRPm9fFa-RxsBuw",
    name: "Holistic App Client Kernel: Process Step Worker",
    description: "Performs actions on behalf of the Holistic App Client Kernel process.",

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
                                        "activate-display-adapter",
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
            const actorName = `[${this.operationID}::${this.operationName}]`;
            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.stepWorker;
            console.log(`${actorName} processing "${messageBody.action}" request on behalf of app client kernel process.`);

            let hackLibResponse  = hackLib.getStatus.request(request_.context);
            if (hackLibResponse.error) {
                errors.push(hackLibResponse.error);
                break;
            }
            const hackDescriptor = hackLibResponse.result;
            const kernelCellData = hackDescriptor.cellMemory;
            let actResponse, ocdResponse;

            switch (messageBody.action) {
            case "noop":
                break;
            case "activate-subprocesses":

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating derived AppMetadata process on behalf of the app client process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.appMetadata",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                processCoordinates: { apmID: "srjZAO8JQ2StYj07u_rgGg" /* "Holistic App Common Kernel: App Metadata Process" */ },
                                                activate: {
                                                    processData: {
                                                        construction: {
                                                            ...kernelCellData.lifecycleResponses.query.result.actionResult.appMetadata
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
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
                    actorTaskDescription: "Activating DOMLocationProcessor process on behalf of the app client kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.domLocationProcessor",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                activate: {},
                                                processCoordinates: { apmID: "-1Ptaq_zTUa8Gfv_3ODtDg" /* "Holistic App Client Kernel: DOM Location Processor" */ }
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
                    actorTaskDescription: "Activating d2r2DisplayAdapter process on behalf of the app client kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.d2r2DisplayAdapter",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                activate: {
                                                    processData: {
                                                        construction: {
                                                            d2r2Components: kernelCellData.lifecycleResponses.query.result.actionResult.d2r2ComponentsArray
                                                        }
                                                    }
                                                },
                                                processCoordinates: { apmID: "IxoJ83u0TXmG7PLUYBvsyg" /* "Holistic Client App Kernel: d2r2/React Client Display Adaptor" */ }
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
                // TODO: Let's leave this out for now until the basic stuff is working end-to-end and requirements are less abstract.
                // { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.serviceProcesses.clientViewProcessor", actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: "Hsu-43zBRgqHItCPWPiBng" /* "Holistic App Client Kernel: Client View Processor" */ } } } } } } } },
                break;

            case "activate-display-adapter":
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
                                                displayLayoutRequest: {
                                                    renderData: kernelCellData.bootROMData.initialDisplayData.renderData
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