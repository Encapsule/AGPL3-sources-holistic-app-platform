// ControllerAction-ovh-map-query-updated-values.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const actionLabel = "queryUpdatedValues";
    const action =  new holarchy.ControllerAction({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: `${cmLabel}::${actionLabel}`,
        description: "Query which ObservableValueHelper cell(s) contained in the ObservableValueHelper cell have been updated since last read.",
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
                            queryUpdatedValues: {
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

