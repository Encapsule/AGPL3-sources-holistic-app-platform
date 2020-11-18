// TransitionOperator-cpm-operator-request-delegate.js

const TransitionOperator = require("../../../TransitionOperator");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const cpmLib = require("./lib");

const transitionOperator = new TransitionOperator({
    id: "DxL0zD_ERu-0kNGX2FvoGg",
    name: "Cell Process Manager: Operator Request Delegate To Cell",
    description: "Generically re-routes the TransitionOperator request specified by operatorRequest to the active cell indicated by apmBindingPath + path, or path (iff path is fully-qualified).",

    operatorRequestSpec: {
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
                    ____defaultValue: "#",
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }

                },
                delegate: {
                    ____types: "jsObject",
                    operatorRequest: { ____accept: "jsObject" },
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

            const messageBody = request_.operatorRequest.CellProcessor.cell;

            let unresolvedCoordinates = messageBody.cellCoordinates;

            if ((Object.prototype.toString.call(unresolvedCoordinates) === "[object String]") && unresolvedCoordinates.startsWith("#")) {
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

            let operatorResponse = request_.context.transitionDispatcher.request({
                context: {
                    ...request_.context,
                    apmBindingPath: targetCellPath
                },
                operatorRequest: messageBody.delegate.operatorRequest,
            });
            if (operatorResponse.error) {
                errors.push("Unrecognized TransitionOperator request format; unable to resolve plug-in filter.");
                errors.push(operatorResponse.error);
                break;
            }

            const operatorFilter = operatorResponse.result;

            operatorResponse = operatorFilter.request({
                context: {
                    ...request_.context,
                    apmBindingPath: targetCellPath
                },
                operatorRequest: messageBody.delegate.operatorRequest,
            });
            if (operatorResponse.error) {
                errors.push("TransitionOperator plug-in failed while processing delegated operator request.");
                errors.push(operatorResponse.error);
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
