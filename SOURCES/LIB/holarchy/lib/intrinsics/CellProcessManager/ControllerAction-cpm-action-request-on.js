// ControllerAction-cpm-action-request-on.js

/*

  { CellProcessor: { activate: { coordinates: variant, data: {...} } } } } // Currently, CPM process create action
  { CellProcessor: { deactivate: { coordinates: variant (optional) } } } } // Currently, CPM process delete action
  { CellProcessor: { query: { coordinates: variant (optional) } } } } // Currently, CPM process query action

  { CellProcessor: { check: { ancestors: { active: {...} } } } }
  { CellProcessor: { check: { ancestors: { allInStep: {...} } } } }
  { CellProcessor: { check: { ancestors: { anyInStep: {...} } } } }
  { CellProcessor: { check: { children: { active: {...} } } } }
  { CellProcessor: { check: { children: { allInStep: {...} } } } }
  { CellProcessor: { check: { children: { anyInStep: {...} } } } }
  { CellProcessor: { check: { desdendants: { active: {...} } } } }
  { CellProcessor: { check: { descendants: { allInStep: {...} } } } }
  { CellProcessor: { check: { descendants: { anyInStep: {...} } } } }
  { CellProcessor: { check: { parent: { active: {...} } } } }
  { CellProcessor: { check: { parent: { inStep: {...} } } } }

  { CellProcessor: { delegate: { actionRequest: {...}, coordinates: variant } } } <-- Currently called actOn in v0.0.47
  { CellProcessor: { delegate: { operatorRequest: {...}, coordinates: variant } } } <--- Currently called opOn on v0.0.47


  { CellProcessor: { link: { coordinates: variant } } } // ControllerAction (currently CPP proxy connect)
  { CellProcessor: { unlink: { coordinates: variant (optional) } } } // ControllerAction (currently CPP proxy disconnect)
  { CellProcessor: { check: { link: { isBroken: {} } } } }
  { CellProcessor: { check: { link: { isConnected: {} } } } }
  { CellProcessor: { check: { link: { isDisconnected: {} } } } }


*/

const ControllerAction = require("../../../ControllerAction");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const cpmLib = require("./lib");

const controllerAction = new ControllerAction({
    id: "wB5QKMYtS7yY2-v7Y3tGWA",
    name: "Cell Process Manager: ControllerAction Request On Cell (actOn)",
    description: "Generically re-routes the ControllerAction request specified by actRequest to the active cell specified by apmBindingPath + path, or path (iff path is fully-qualified).",

    actionRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            delegate: {
                ____types: "jsObject",
                actionRequest: { ____accept: "jsObject" },
                coordinates: {
                    ____types: [
                        "jsString", // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell. Or, an IRUT that resolves to a known cellProcessID.
                        "jsObject", // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                    ],
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
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

            const messageBody = request_.actionRequest.CellProcessor.delegate;

            let coordinates = messageBody.coordinates;

            const coordinatesTypeString = Object.prototype.toString.call(coordinates);
            if (Object.prototype.toString.call(coordinates) === "[object String]") {
                let ocdResponse = ObservableControllerData.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: coordinates });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                coordinates = ocdResponse.result;
            }

            let cpmLibResponse = cpmLib.resolveCellCoordinates.request({ coordinates, ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            let targetCellPath = cpmLibResponse.result.cellPath;

            let actResponse = request_.context.act({
                actorName: "Cell Process Manager: actOn",
                actorTaskDescription: `Delegating ControllerAction request to cell at path '${targetCellPath}'.`,
                actionRequest: messageBody.actionRequest,
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
