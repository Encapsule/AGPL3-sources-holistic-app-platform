// TransitionOperator-cpm-ancestor-processes-active.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

const transitionOperator = new TransitionOperator({
    id: "gJnA-VJTTLa0g9TKFmjv1Q",
    name: "Cell Process Manager: Ancestor Processes Active",
    description: "Return Boolean true if request.context.apmBindingPath is a cell process with active ancestor processes.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                ancestorProcessesActive: {
                    ____types: "jsObject",
                    filterBy: cellProcessQueryRequestFilterBySpec
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.operatorRequest.holarchy.CellProcessor.ancestorProcessesActive;

            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;

            cpmLibResponse = cpmLib.getProcessAncestorDescriptors.request({
                cellProcessID: arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result,
                filterBy: message.filterBy,
                ocdi: request_.context.ocdi,
                treeData: ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const ancestorCellProcessDescriptors = cpmLibResponse.result;
            response.result = ancestorCellProcessDescriptors.length?true:false;
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
