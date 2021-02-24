// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Cell Exists`;

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueBase.mapLabels({ TOP: operatorName }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true iff the ObservableValue cell exists in the cellplane at the specified path / coordinates.",
        operatorRequestSpec: {
            ____label: "ObservableValue Cell Exists Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValue: {
                            ____types: "jsObject",
                            cellExists: {
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

        bodyFunction: function(operatorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                // This is really very straight forward at this level of abstraction (forget about how this action request got here; that's rather obstruse...)
                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValue.cellExists;
                let ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.__apmiStep` });
                response.result = (ocdResponse.error?false:true);
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    });

    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }

    module.exports = operator;

})();

