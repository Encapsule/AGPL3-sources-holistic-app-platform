// ControllerAction-cpm-cell-plane-error.js

const ControllerAction = require("../../../ControllerAction");

const controllerAction = new ControllerAction({
    id: "Rd5sgBjkSyq25-xIwydPRA",
    name: "Cell Process Manager: Cell Plane Error Handler",
    description: "This action is dispatched generically from OPC.act when an external actor makes an action request that produces a response.error. Or, a response.result.lastEvaluation containing transport error(s).",

    actionRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            _private: {
                ____types: "jsObject",
                opcCellPlaneErrorNotification: {
                    ____types: "jsObject",
                    errorType: {
                        ____accept: "jsString",
                        ____inValueSet: [ "action-error", "transport-error" ]
                    },
                    opcActResponse: { ____accept: "jsObject" }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "okay"
    },

    bodyFunction: function(opcCellPlaneErrorNotification_) {
        return { error: null };
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;
