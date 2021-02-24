// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Has Updated`;

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueBase.mapLabels({ TOP: operatorName }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true iff the ObservableValue cell's value has been written (updated) since the last time a specific observer (the caller of the this operator) queried the ObservableValue for update(s).",
        operatorRequestSpec: {
            ____label: "ObservableValue Value Has Updated Operator Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValue: {
                            ____types: "jsObject",
                            valueHasUpdated: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                },
                                lastReadRevision: {
                                    ____label: "ObservableValue Observer Revision",
                                    ____description: "The last revision of this ObservableValue cell's value that was read by the requesting observer cell.",
                                    ____accept: "jsNumber"
                                }
                            }
                        }
                    }
                }
            }
        },

        bodyFunction: function(operatorRequest_) {
            return { error: null, result: true }; // TODO
        }

    });

    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }

    module.exports = operator;

})();

