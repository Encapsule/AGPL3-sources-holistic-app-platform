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
                query: {
                    ____types: "jsObject",
                    filterBy: cellProcessQueryRequestFilterBySpec,
                    childProcessesActive: { ____accept: "jsObject" }
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

            const messageBody = request_.operatorRequest.CellProcessor.cell;

            const cpmLibResponse = cpmLib.cellProcessFamilyOperatorPrologue.request({
                unresolvedCellCoordinates: messageBody.cellCoordinates,
                apmBindingPath: request_.context.apmBindingPath,
                ocdi: request_.context.ocdi
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const prologueData = cpmLibResponse.result;

            cpmLibResponse = cpmLib.getProcessChildrenDescriptors.request({
                cellProcessID: prologueData.resolvedCellCoordinates.cellPathID,
                filterBy: messageBody.query.filterBy,
                ocdi: request_.context.ocdi,
                treeData: prologueData.ownedCellProcessesData
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


