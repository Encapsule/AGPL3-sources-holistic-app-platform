// ObservableValue_T/ObservableValueBase/ControllerAction-ObservableValueBase-set-dact.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Set Deferred Action`;

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueBase.mapLabels({ CM: cmLabel, ACT: actionName }).result.ACTID,
        name: actionName,
        description: "Sets a deferred action on an ObservableValue that will yield a new value to return opportunistically when the ObservableValue mailbox value is read.",
        actionRequestSpec: {
            ____label: `${actionName} Request`,
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ObservableValue: {
                            ____types: "jsObject",
                            setDeferredAction: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                },
                                dact: {
                                    ____accept: [
                                        "jsObject", // SET DACT: An actionRequest descriptor that is dispatched by readValue in the context of the provider cell.
                                        "jsUndefined" // RESET DACT: If undefined then any pending dact is cleared.
                                    ]
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
        bodyFunction: function(actionRequest_) {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                console.log(`[${this.operationID}::${this.operationName}] called on provider cell "${actionRequest_.context.apmBindingPath}"`);
                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValue.setDeferredAction;
                let ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.__apmiStep` });
                if (ocdResponse.error) {
                    errors.push("Okay - hold up! You cannot set a deferred action on an ObservableValue cell that is not active!");
                    errors.push(ocdResponse.error);
                    break;
                }
                // Set/reset the dact on the ObservableValue cell instance.
                ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.dact` }, messageBody.dact);
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
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

