// ControllerAction-app-client-kernel-signal-lifecycle-event.js

const holarchy = require("@encapsule/holarchy");
const hackLib = require("./lib");

// This action is never expected to be called by an external actor.
// It is only ever expected to be dispatched in response to a process
// step transition in the holistic app client kernel cell process.
// In this capacity, this action is very similar to this CellModel's
// "step worker" action in the way that functions to define the concrete
// runtime semantics of evaluating an holistic app client kernel cell.

const controllerAction = new holarchy.ControllerAction({
    id: "mmLcuWywTe6lUL9OtMJisg",
    name: "Holistic App Client Kernel: Signal Lifecycle Event",
    description: "Forwards a holistic app client lifecycle signal to the derived app client service process.",

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
                                    ____inValueSet: [ "start" ] // hashroute? Does this action even make sense anymore? Can we not communicate w/the dervied app cell from the step worker?
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

            let hackLibResponse  = hackLib.getStatus.request(request_.context);
            if (hackLibResponse.error) {
                errors.push(hackLibResponse.error);
                break;
            }
            let hackDescriptor = hackLibResponse.result;
            let kernelCellData = hackDescriptor.cellMemory;
            let actResponse, ocdResponse;

            switch (messageBody.eventLabel) {

                // ----------------------------------------------------------------
            case "start":

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                                delegate: { actionRequest: { holistic: { app: { client: { lifecycle: { start: {} } } } } } }
                            }
                        }
                    }
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                response.result = actResponse.result.actionResult;

                break;

                // ----------------------------------------------------------------

            default:
                errors.push(`INTERNAL ERROR: Unhandled eventLabel value '${messageBody.eventLabel}'.`);
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
