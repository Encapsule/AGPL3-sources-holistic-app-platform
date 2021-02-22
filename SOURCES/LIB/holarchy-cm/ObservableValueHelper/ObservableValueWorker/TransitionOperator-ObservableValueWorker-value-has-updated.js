// TransitionOperator-ObservableValueWorker-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueWorker = require("./cmasObservableValueWorker");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Has Updated`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueWorker.mapLabels({ TOP: "valueHasUpdated" }).result.TOPID,
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
                        ObservableValueWorker: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                valueHasUpdated: {
                                    ____types: "jsObject"
                                }
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
