// ControllerAction-ObservableValueHelper-configure.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    const lib = require("./lib");

    const apmObservableValueHelper = require("./AbstractProcessModel-ObservableValueHelper");
    const configurationSpec = { ...apmObservableValueHelper._private.declaration.ocdDataSpec.configuration, ____defaultValue: undefined, observableValue: { ...apmObservableValueHelper._private.declaration.ocdDataSpec.configuration.observableValue, ____defaultValue: undefined } };

    const action = new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: "configure" }).result.ACTID,
        name: `${cmLabel} Configure`,
        description: `Allows an actor to configure a ${cmLabel} cell instance.`,
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
                            configure: {
                                ____label: "ObservableValueHelper Link Request",
                                ____description: "This action links an ObservableValueHelper cell instance to an ObservableValue family cell using information specified in this request.",
                                ____types: "jsObject",
                                path: {
                                    ____label: "Helper Path",
                                    ____description: "The relative path of the ObservableValueHelper cell to configure relative to actionRequest.context.apmBindingPath that is presumed to be a cell process that owns the ObservableValue family cell of interest.",
                                    ____accept: "jsString",
                                    ____defaultValue: "#" // only ever correct if the ObservableValue family cell you want to connect to is to be used as a cell process (atypical) and not as a cell helper (typical).
                                },
                                configuration: { ...configurationSpec }
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

                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValueHelper.configure;

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

                if (cellMemory.__apmiStep !== "observable-value-helper-reset") {
                    errors.push(`Sorry. The ObservableValueHelper cell at "${ovhBindingPath}" is currently in process step "${cellMemory.__apmiStep}" and cannot be configure/re-configured by calling this action until its reset action is called.`);
                    break;
                }

                ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: ovhBindingPath, dataPath: "#.configuration" }, messageBody.configuration);
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

