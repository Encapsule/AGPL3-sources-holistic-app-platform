// TransitionOperator-cpm-operator-request-on.js

const TransitionOperator = require("../../../TransitionOperator");
const ObservableControllerData = require("../../../lib/ObservableControllerData");

const transitionOperator = new TransitionOperator({
    id: "DxL0zD_ERu-0kNGX2FvoGg",
    name: "Cell Process Manager: Operator Request On Cell (opOn)",
    description: "Generically re-routes the TransitionOperator request specified by opRequest to the active cell indicated by apmBindingPath + path, or path (iff path is fully-qualified).",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                opOn: {
                    ____types: "jsObject",
                    cellPath: {
                        ____accept: "jsString",
                        ____defaultValue: "#"
                    },
                    opRequest: { ____accept: "jsObject" }
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

            const messageBody = request_.actionRequest.holarchy.CellProcessor.opOn;

            let ocdResponse = ObservableControllerData.dataPathResolve({
                dataPath: messageBody.cellPath,
                apmBindingPath: request_.context.apmBindingPath
            });

            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            const targetCellPath = ocdResponse.result;

            let operatorResponse = request_.context.transitionDispatcher({
                context: request_.context,
                operatorRequest: messageBody.opRequest,
                apmBindingPath: targetCellPath
            });
            if (operatorResponse.error) {
                errors.push("Unable to resolve TransitionOperator plug-in to process specified request:");
                errors.push(operatorResponse.error);
                errros.push("Check the format of your TransitionOperator request for syntax error(s). Failing that, possibly you have failed to register CellModel's?");
                break;
            }

            const operatorFilter = operatorResponse.result;

            operatorResponse = operatorFilter.request({
                context: request_.context,
                operatorRequest: messageBody.opRequest,
                apmBindingPath: targetCellPath
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
