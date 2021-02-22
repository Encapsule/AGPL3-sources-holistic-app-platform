// TransitionOperator-ObservableValueHelper-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueHelper = require("./cmasObservableValueHelper");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Has Updated`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueHelper.mapLabels({ TOP: "valueHasUpdated" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the target ObservableValue cell's value has been written since we last read the value.",
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
                            valueHasUpdated: {
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
