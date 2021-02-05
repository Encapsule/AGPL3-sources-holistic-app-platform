// ControllerAction-value-observer-configure.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");



(function() {

    const lib = require("./lib");

    const apmValueObserver = require("./AbstractProcessModel-value-observer");
    const configurationDataSpec = { ...apmValueObserver._private.declaration.ocdDataSpec.configuration };
    delete configurationDataSpec.____defaultValue;

    const action = new holarchy.ControllerAction({
        id: arccore.identifier.irut.fromReference("@encapsule/holarchy-cm.ValueObserver.ControllerAction.configure").result,
        name: "ValueObserver Configure",
        description: "ValueObserver configure action write configuration data into the cell instance indicated by apmBindingPath.",
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
                            configure: {
                                ...configurationDataSpec
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

