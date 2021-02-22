// ControllerAction-ObservableValueHelper-reset.js

// This action resets the target ObservableValueHelper back to its uninitialized state.
// This action may be called on an ObservableValueHelper cell while it is in any process step.

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueHelper = require("./cmasObservableValueHelper");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Reset Helper`;
    const lib = require("./lib");
    const action = new holarchy.ControllerAction({
        id: cmasObservableValueHelper.mapLabels({ ACT: "reset" }).result.ACTID,
        name: actionName,
        description: "Resets the ObservableValueHelper cell back to its uninitialized process step.",
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
                            reset: {
                                ____types: "jsObject"
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
            return { error: null }; // TODO
        }
    });
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;

})();

