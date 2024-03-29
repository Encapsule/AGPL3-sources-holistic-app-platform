// ControllerAction-cpm-action-request-delegate.js

const ControllerAction = require("../../../ControllerAction");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const cpmLib = require("./lib");

const controllerAction = new ControllerAction({
    id: "wB5QKMYtS7yY2-v7Y3tGWA",
    name: "Cell Process Manager: ControllerAction Request Delegate To Cell",
    description: "Generically re-routes the ControllerAction request specified by actRequest to the active cell specified by apmBindingPath + path, or path (iff path is fully-qualified).",

    actionRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            cell: {
                ____types: "jsObject",
                cellCoordinates: {
                    ____types: [
                        "jsString", // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell. Or, an IRUT that resolves to a known cellProcessID.
                        "jsObject", // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                    ],
                    ____defaultValue: "#", // i.e. query the current cell
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
                },
                delegate: {
                    ____types: "jsObject",
                    actionRequest: { ____accept: "jsObject" },
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

            const messageBody = request_.actionRequest.CellProcessor.cell;

            let unresolvedCoordinates = messageBody.cellCoordinates;

            if (Object.prototype.toString.call(unresolvedCoordinates) === "[object String]") {
                let ocdResponse = ObservableControllerData.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: unresolvedCoordinates });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                unresolvedCoordinates = ocdResponse.result;
            }

            let cpmLibResponse = cpmLib.resolveCellCoordinates.request({ coordinates: unresolvedCoordinates, ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            let targetCellPath = cpmLibResponse.result.cellPath;

            let actResponse = request_.context.act({
                actorName: "Cell Process Manager: actOn",
                actorTaskDescription: `Delegating ControllerAction request to cell at path '${targetCellPath}'.`,
                actionRequest: messageBody.delegate.actionRequest,
                apmBindingPath: targetCellPath
            });

            if (actResponse.error) {
                errors.push(actResponse.error);
                break;
            }

            response.result = actResponse.result.actionResult;
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
