// TransitionOperator-ObservableValueHelper-has-link-error.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Has Link Error`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, TOP: "hasLinkError" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the specified ObservableValueHelper cell is not reset and not linked to the target ObservableValue cell's provider cell process.",
        operatorRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValueHelper: {
                            ____types: "jsObject",
                            hasLinkError: {
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
                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValueHelper.hasLinkError;
                // Query the cell process step of the indicated ObservableValueHelper cell.
                let operatorRequest = {
                    ...operatorRequest_,
                    operatorRequest: { CellProcessor: { cell: { cellCoordinates: messageBody.path, query: { inStep: { apmStep: "observable-value-helper-link-error" } } } } }
                };
                let operatorResponse = operatorRequest_.context.transitionDispatcher.request(operatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }
                let operatorFilter = operatorResponse.result;
                response = operatorFilter.request(operatorRequest);
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!operator.isValid()) { throw new Error(operator.toJSON()); }

    module.exports = operator;

})();
