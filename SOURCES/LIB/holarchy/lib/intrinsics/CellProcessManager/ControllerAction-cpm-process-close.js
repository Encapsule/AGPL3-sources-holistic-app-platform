// ControllerAction-cpm-shared-process-close.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

const action = new ControllerAction({

    id: "1Puwq4UEQZuJy6pOrkvZSg",
    name: "Cell Process Manager: Close Cell Process",
    description: "Instruct CellProcessor to unlink the indicated worker proxy subcell from the shared cell process instance.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    close: {
                        ____types: "jsObject",
                        proxyPath: {
                            ____accept: "jsString",
                            ____defaultValue: "#"
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsUndefined"
    },

    bodyFunction: function(request_) {
        return { error: null };
    }

});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports= action;
