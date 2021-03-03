// ControllerAction-app-client-display-pump-display-view-stream.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolisticHTML5ServicePackage = require("../cmasHolisticHTML5ServicePackage");
    const cmLabel = require("./cell-label");
    const actionLabel =  "pumpDisplayViewStream";
    const actionName = `${cmLabel} Pump Display View Stream`;

    const action = new holarchy.ControllerAction({

        id: cmasHolisticHTML5ServicePackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Dispatched to read an updated DisplayStreamMessage from our ObservableValueHelper and call React.",

        actionRequestSpec: {
            ____types: "jsObject",
            holistic: {
                ____types: "jsObject",
                app: {
                    ____types: "jsObject",
                    client: {
                        ____types: "jsObject",
                        display: {
                            ____types: "jsObject",
                            _private: { // We're going to trigger this from APM step transition rule
                                ____types: "jsObject",
                                pumpDisplayStream: {
                                    ____types: "jsObject",
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

                let actResponse = request_.context.act({
                    actorName: actionName,
                    actorTaskDescription: "Attempting to read a new DisplayStreamMessage from our ObservableValueHelper input...",
                    actionRequest: { holarchy: { common: { actions: { ObservableValueHelper: { readValue: { path: "#.inputs.displayViewStream" } } } } } },
                    apmBindingPath: request_.context.apmBindingPath // because we're triggered by APM step transition rule
                });

                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                const displayStreamMessage = actResponse.result.actionResult;

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    });


    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;


})();

