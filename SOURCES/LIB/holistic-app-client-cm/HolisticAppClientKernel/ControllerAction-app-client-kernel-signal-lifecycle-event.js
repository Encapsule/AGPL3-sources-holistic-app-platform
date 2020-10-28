// ControllerAction-app-client-kernel-signal-lifecycle-event.js

const holarchy = require("@encapsule/holarchy");

const controllerAction = new holarchy.ControllerAction({
    id: "mmLcuWywTe6lUL9OtMJisg",
    name: "Holistic App Client Kernel: Signal Lifecycle Event",
    description: "Forwards a holistic app client lifecycle signal to the derived client application's daemon proces.",

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
                            signalLifecycleEvent: {
                                ____types: "jsObject",
                                eventLabel: {
                                    ____types: "jsString",
                                    ____inValueSet: [ "init", "query", "deserialize", "config", "start", "error" ]
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    actionResultSpec: { ____opaque: true },

    bodyFunction: function (request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const actorName = `[${this.operationID}::${this.operationName}]`;
            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.signalLifecycleEvent;
            console.log(`${actorName} signaling lifecycle event '${messageBody.eventLabel}'...`);
            let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            let namespaceSpec = ocdResponse.result;
            if (!namespaceSpec.____appdsl || !namespaceSpec.____appdsl.apm || namespaceSpec.____appdsl.apm !== "PPL45jw5RDWSMNsB97WIWg") {
                errors("This action may only be called on a holistic app client kernel process.");
                break;
            }
            ocdResponse = request_.context.ocdi.readNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#._private" });
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const kernelPrivateData = ocdResponse.result;

            let actResponse;

            switch (messageBody.eventLabel) {
            case "init":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel init lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: {
                                    actionRequest: { holistic: { app: { client: { lifecycle: { init: {} } } } } }
                                }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                break;
            case "query":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: { actionRequest: { holistic: { app: { client: { lifecycle: { query: {} } } } } } }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                const appQueryResult = actResponse.result.actionResult;
                ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#._private.appQueryResult" }, appQueryResult);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                break;
            case "deserialize":
                const bootROMElement = document.getElementById(kernelPrivateData.bootROMElementID);
                const bootDataBase64 = bootROMElement.textContent;
                const bootDataJSON = new Buffer(bootDataBase64, 'base64').toString('utf8');
                const bootROMData = JSON.parse(bootDataJSON);
                bootROMElement.parentNode.removeChild(bootROMElement); // delete the DOM node
                ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#._private.bootROMData" }, bootROMData);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: { actionRequest: { holistic: { app: { client: { lifecycle: { deserialize: { bootROMData } } } } } } }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                const appBootROMData = actResponse.result.actionResult;
                ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#._private.appBootROMData"}, appBootROMData);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                break;
            case "config":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Querying the holistic app client kernel cell process to obtain information about shared subsystem cell processes.",
                    actionRequest: { CellProcessor: { cell: { cellCoordinates: "#", query: {} } } },
                    apmBindingPath: request_.context.apmBindingPath
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                const cellProcessQueryResult = actResponse.result.actionResult;

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: {
                                    actionRequest: {
                                        holistic: {
                                            app: {
                                                client: {
                                                    lifecycle: {
                                                        config: {
                                                            appBootROMData: kernelPrivateData.appBootROMData,
                                                            appRuntimeServiceProcesses: {
                                                                appClientKernelProcessID: cellProcessQueryResult.query.cellProcessID,
                                                                d2r2DisplayAdapterProcessID: kernelPrivateData.serviceProcesses.d2r2DisplayAdapter.result.cellProcessID,
                                                                domLocationProcessorProcessID: kernelPrivateData.serviceProcesses.domLocationProcessor.result.cellProcessID
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                break;
            case "start":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: { actionRequest: { holistic: { app: { client: { lifecycle: { start: {} } } } } } }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                break;
            case "error":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelPrivateData.derivedAppClientProcessCoordinates,
                                delegate: { actionRequest: { holistic: { app: { client: { lifecycle: { error: {} } } } } } }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                break;
            default:
                errors.push(`Unhandled eventLabel value '${messageBody.eventLabel}'.`);
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
