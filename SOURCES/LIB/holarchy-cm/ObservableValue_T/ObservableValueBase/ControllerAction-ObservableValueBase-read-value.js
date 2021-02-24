// ObservableValue_T/ObservableValueBase/ControllerAction-read-value.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Read Value`;

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueBase.mapLabels({ ACT: actionName }).result.ACTID,
        name: actionName,
        description: "Reads and returns an ObervableValue from any active cell that is a member of the ObservableValue CellModel family.",
        actionRequestSpec: {
            ____label: "ObservableValue Read Action Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    ObservableValue: {
                        ____types: "jsObject",
                        readValue: {
                            ____types: "jsObject",
                            path: {
                                ____accept: "jsString",
                                ____defaultValue: "#"
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____label: "ObservableValue Read Action Result",
            ____types: "jsObject",
            value: { ____opaque: true },
            revision: { ____accept: "jsNumber" }
        },
        bodyFunction: function(actionRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = true;
            while (!inBreakScope) {
                inBreakScope = true;

                let ocdResponse = actionRequest_.context.ocdi.readNamespace(actionRequest_.context.apmBindingPath);

                if (ocdResponse.error) {
                    errors.push(`Unable to read ObservableValue at apmBindingPath="${actionRequest_.context.apmBindingPath}" due to error: ${ocdResponse.error}`);
                    errors.push("Typically, this error indicates that the actor who created the action request did not specify apmBindingPath correctly.");
                    break;
                }

                const observableValueCellMemory = ocdResponse.result;

                if (!observableValueCellMemory.__apmiStep) {
                    errors.push(`Unable to read ObservableValue cell at apmBindingPath="${actionRequest_.context.apmBindingPath}" due to error: The specified apmBindingPath does not resolve to an active cell.`);
                    errors.push("Typically, this error indicates that the actor who created the action request did not specify apmBindingPath correctly.");
                    break;
                }

                if (!observableValueCellMemory.__apmiStep !== "observable-value-ready") {
                    errors.push(`Unable to read ObservableValue cell at apmBindingPath="${actionRequest_.context.apmBindingPath}" because the ObservableValue cell process has not yet had a value written to it.`);
                    break;
                }

                response.result = observableValueCellMemory; // Note that anything included in response.result that is not also declared in actionResultSpec will be clipped out of what the caller sees returned via actionResponse.result.actionResult.

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

