// ControllerAction-cpm-shared-process-close.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

const action = new ControllerAction({

    id: "1Puwq4UEQZuJy6pOrkvZSg",
    name: "Cell Process Manager: Shared Process Close",
    description: "Tell CellProcess instance to close a shared cell process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                sharedProcess: {
                    ____types: "jsObject",
                    close: {
                        ____types: "jsObject"
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

module.exports= action;
