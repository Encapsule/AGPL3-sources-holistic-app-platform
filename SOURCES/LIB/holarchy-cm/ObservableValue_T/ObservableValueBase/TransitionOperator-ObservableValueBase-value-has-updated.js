// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cellModelLabel = require("./cell-label");

    const operatorName = `${cellModelLabel}.operator.valueHasUpdated`;

    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ TOP: operatorName }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true iff the ObservableValue cell's value has been written (updated) since the last time a specific observer (the caller of the this operator) queried the ObservableValue for update(s).",
        operatorRequestSpec: {
            ____label: "ObservableValue Value Has Updated Operator Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    ObservableValue: {
                        ____types: "jsObject",
                        valueHasUpdated: {
                            ____types: "jsObject",
                            since: {
                                ____types: "jsObject",
                                revision: {
                                    ____label: "ObservableValue Observer Revision",
                                    ____description: "The last revision of this ObservableValue cell's value that was read by the requesting observer cell.",
                                    ____types: [
                                        "jsNumber", // The observer is specifying the value revision they last read by its literal value
                                        "jsString", // The observer is specifying the full path of the OCD namespace _they_ own and maintain which contains the value revision they last read (we read this value and use it as the comparison basis)
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },

        bodyFunction: function(operatorRequest_) {
            return { error: null, result: false }; // TODO
        }

    });

    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }

    module.exports = operator;

})();
