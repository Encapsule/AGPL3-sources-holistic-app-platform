// TransitionOperator-ObsevableValueHelper-value-is-active.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueHelper = require("./cmasObservableValueHelper");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Is Active`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueHelper.mapLabels({ TOP: "valueIsActive" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the target ObservableValue cell is active.",
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
                            valueIsActive: {
                                ____types: "jsObject"
                            }
                        }
                    }
                }
            }
        },
        bodyFunction: function(operatorRequest_) {
            return { error: null, result: false };
        }

    });

    if (!operator.isValid()) { throw new Error(operator.toJSON()); }

    module.exports = operator;



})();

