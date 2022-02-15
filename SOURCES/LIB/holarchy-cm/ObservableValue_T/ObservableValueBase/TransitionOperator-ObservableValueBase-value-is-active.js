// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-is-active.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Is Active`;

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueBase.mapLabels({ CM: cmLabel, TOP: operatorName }).result.TOPID,
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
                            // TODO: Should be renamed to valueIsActive for consistency w/ObservableValueWorker naming I think.
                            valueIsActive: {
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
                console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] called on provider cell "${operatorRequest_.context.apmBindingPath}"`);
                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValue.valueIsActive;
                // If we cannot read the ObservableValue cell's revision number, then it does not exist.
                let ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.revision` });
                response.result = (ocdResponse.error?false:true);
                console.log(`> Answer is ${response.result} --- value cell is ${response.result?"ACTIVE":"INACTIVE"}.`);
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

