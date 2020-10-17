// TransitionOperator-cpm-operator-request-on.js

const TransitionOperator = require("../../../TransitionOperator");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const cpmLib = require("./lib");

const transitionOperator = new TransitionOperator({
    id: "DxL0zD_ERu-0kNGX2FvoGg",
    name: "Cell Process Manager: Operator Request On Cell (opOn)",
    description: "Generically re-routes the TransitionOperator request specified by operatorRequest to the active cell indicated by apmBindingPath + path, or path (iff path is fully-qualified).",

    operatorRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            delegate: {
                ____types: "jsObject",
                operatorRequest: { ____accept: "jsObject" },
                coordinates: {
                    ____types: [
                        "jsString", // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell. Or, an IRUT that resolves to a known cellProcessID.
                        "jsObject", // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                    ],
                    ____defaultValue: "#",
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }

                }
            }
        }
    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const messageBody = request_.operatorRequest.CellProcessor.delegate;

            let coordinates = messageBody.coordinates;

            const coordinatesTypeString = Object.prototype.toString.call(coordinates);
            if (("[object String]" === coordinatesTypeString) && messageBody.coordinates.startsWith("#")) {
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

            let operatorResponse = request_.context.transitionDispatcher.request({
                context: {
                    ...request_.context,
                    apmBindingPath: targetCellPath
                },
                operatorRequest: messageBody.operatorRequest,
            });
            if (operatorResponse.error) {
                errors.push("Unable to resolve TransitionOperator plug-in to process specified request:");
                errors.push(operatorResponse.error);
                errros.push("Check the format of your TransitionOperator request for syntax error(s). Failing that, possibly you have failed to register CellModel's?");
                break;
            }

            const operatorFilter = operatorResponse.result;

            operatorResponse = operatorFilter.request({
                context: {
                    ...request_.context,
                    apmBindingPath: targetCellPath
                },
                operatorRequest: messageBody.operatorRequest,
            });
            if (operatorResponse.error) {
                errors.push("We were not able to delegate your TransitionOperator request to a plug-in. However, the plug-in subsequently rejected your request with error:");
                errors.push(operatorResponse.error);
                errors.push("Check the details of TransitionOperator plug-in to ensure you're calling it correctly.");
                break;
            }

            response.result = operatorResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!transitionOperator.isValid()) {
    throw new Error(transitionOperator.toJSON());
}

module.exports = transitionOperator;
