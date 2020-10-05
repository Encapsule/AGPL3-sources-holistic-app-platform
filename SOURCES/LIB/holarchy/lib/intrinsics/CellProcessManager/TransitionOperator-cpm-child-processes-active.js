// TransitionOperator-cpm-child-processes-active.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

module.exports = new TransitionOperator({
    id: "xIRhBHueTRGO0xq63UUbyQ",
    name: "Cell Process Manager: Child Processes Active",
    description: "Returns Boolean true iff request.context.apmBindingPath is a cell process with one or more child cell processes.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                childProcessesActive: {
                    ____types: "jsObject",
                    filterBy: cellProcessQueryRequestFilterBySpec
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null, result: false };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.operatorRequest.holarchy.CellProcessor.childProcessesActive;

            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;

            cpmLibResponse = cpmLib.getProcessChildrenDescriptors.request({
                cellProcessID: arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result,
                filterBy: message.filterBy,
                ocdi: request_.context.ocdi,
                treeData: ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const childCellProcessDescriptors = cpmLibResponse.result;
            response.result = childCellProcessDescriptors.length?true:false;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});


