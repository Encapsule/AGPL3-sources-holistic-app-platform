// ControllerAction-ObservableValueHelper-get-link-error.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueHelper = require("./cmasObservableValueHelper");
    const cmLabel = require("./cell-label");
    const lib = require("./lib");
    const apmObservableValueHelper = require("./AbstractProcessModel-ObservableValueHelper");

    const configurationSpec = { ...apmObservableValueHelper._private.declaration.ocdDataSpec.configuration, ____defaultValue: undefined, observableValue: { ...apmObservableValueHelper._private.declaration.ocdDataSpec.configuration.observableValue, ____defaultValue: undefined } };

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueHelper.mapLabels({ ACT: "getLinkError" }).result.ACTID,
        name: `${cmLabel} Get Link Error`,
        description: "Retrieves link error message string if the process is in the observable-value-helper-link-error step. Or, null.",
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ObservableValueHelper: {
                            ____types: "jsObject",
                            getLinkError: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____accept: [ "jsNull", "jsString" ]
        },
        bodyFunction: function(actionRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValueHelper.getLinkError;

                let ocdResponse = holarchy.ObservableControllerData.dataPathResolve({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: messageBody.path });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                const ovhBindingPath = ocdResponse.result;

                let libResponse = lib.getStatus.request({ ...actionRequest_.context, apmBindingPath: ovhBindingPath });
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }

                const { cellMemory } = libResponse.result;

                if (cellMemory.__apmiStep !== "observable-value-helper-link-error") {
                    response.result = null;
                    break;
                }

                ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: cellMemory.observableValueWorkerProcess.apmBindingPath, dataPath: "#.ovcpProviderProxyError" });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                response.result = ocdResponse.result;

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

