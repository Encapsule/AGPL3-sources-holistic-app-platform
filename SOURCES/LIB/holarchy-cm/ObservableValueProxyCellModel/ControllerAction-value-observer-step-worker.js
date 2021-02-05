// ControllerAction-value-observer-step-worker.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: arccore.identifier.irut.fromReference("@encapsule/holarchy-cm.ValueObserver.ControllerAction.stepWorker").result,
        name: "ValueObserver Step Worker",
        description: "ValueObserver Step Worker action.",
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                cm: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ValueObserver: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                stepWorker: {
                                    ____types: "jsObject",
                                    action: {
                                        ____accept: "jsString",
                                        ____inValueSet: [ "noop" ]
                                    }
                                }
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
            return { error: null };
        }
    });
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;
})();

