// SOUCES/LIB/holarchy/lib/intrinsics/CellProcessManager/ControllerAction-cpm-shared-process-open.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

const action = new ControllerAction({

    id: "MAaYEUinReO3AKaTI21CaQ",
    name: "Cell Process Manager: Shared Process Attach Singleton",
    description: "Tell CellProcessor instance to open a shared cell process singleton.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                sharedProcess: {
                    ____types: "jsObject",
                    attach: {
                        ____types: "jsObject",
                        proxy: {
                            ____types: "jsObject",
                            path: { ____accept: "jsString", ____defaultValue: "#" }
                        },
                        singleton: {
                            ____types: "jsObject",
                            apmID: { ____accept: "jsString" }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
    }


});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;


