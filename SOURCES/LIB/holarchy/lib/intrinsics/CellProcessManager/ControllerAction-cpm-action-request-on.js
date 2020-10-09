// ControllerAction-cpm-aciton-request-on.js

const ControllerAction = require("../../../ControllerAction");
const ObservableControllerData = require("../../../lib/ObservableControllerData");

const controllerAction = new ControllerAction({
    id: "wB5QKMYtS7yY2-v7Y3tGWA",
    name: "Cell Process Manager: ControllerAction Request On Cell (actOn)",
    description: "Generically re-routes the ControllerAction request specified by actRequest to the active cell specified by apmBindingPath + path, or path (iff path is fully-qualified).",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                actOn: {
                    ____types: "jsObject",
                    path: {
                        ____accept: "jsString",
                        ____defaultValue: "#"
                    },
                    actRequest: { ____accept: "jsObject" }
                }
            }
        }
    },

    actionResultSpec: {
        ____opaque: true // The response.result returned by the ControllerAction that processed the re-routed actRequest is returned w/out inspection.
    },

    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const messageBody = request_.actionRequest.holarchy.CellProcessor.actOn;

            let ocdResponse = ObservableControllerData.dataPathResolve({
                dataPath: messageBody.path,
                apmBindingPath: request_.apmBindingPath
            });

            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            const targetCellPath = ocdResponse.result;

            let actResponse = request_.context.act({
                actorName: "Cell Process Manager: actOn",
                actorTaskDescription: `Delegating ControllerAction request to cell at path '${targetCellPath}'.`,
                actionRequest: messageBody.actRequest,
                apmBindingPath: targetCellPath
            });

            if (actResponse.error) {
                errors.push("We were not able to delegate your ControllerAction request due to error:");
                errors.push(actResponse.error);
                break;
            }

            response.result = actResponse.result;
            break;
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }

        return response;

    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;
