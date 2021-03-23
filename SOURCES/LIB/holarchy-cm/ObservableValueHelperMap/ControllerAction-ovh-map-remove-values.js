// ControllerAction-ovh-map-remove-values.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const actionLabel = "removeValues";
    const action =  new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: `${cmLabel}::${actionLabel}`,
        description: "Remove all or specific nameed ObservableValueHelper cells from the ObservableValueHelperMap cell.",
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ObservableValueHelperMap: {
                            ____types: "jsObject",
                            removeSignals: {
                                ____accept: "jsObject"
                                // TODO
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____types: "jsObject"
            // TODO
        },
        bodyFunction: function(request_) {
            return { error: null, result: {} };
        }
    });
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;
})();

