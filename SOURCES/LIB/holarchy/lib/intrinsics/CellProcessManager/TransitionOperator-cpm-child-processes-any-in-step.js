// TransitionOperator-cpm-child-processes-any-in-step.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

module.exports = new TransitionOperator({
    id: "esuJGgmERrSV3AFvFOMyhw",
    name: "Cell Process Manager: Child Processes Any In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process with any child cell process in the specified process step.",
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
                    childProcessesAnyInStep: {
                        ____types: "jsObject",
                        apmStep: {
                            // If apmStep is a single step name (string) then all child cell processes must be in that step.
                            // If apmStep is an array of step names (strings), then all child cell processes must be in any of the indicated steps.
                            ____types: [ "jsString", "jsArray" ],
                            stepName: { ____accept: "jsString" }
                        }
                    }
                },
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

            let cpmLibResponse = cpmLib.cellProcessFamilyOperatorPrologue.request({
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

            if (!childCellProcessDescriptors.length) {
                response.result = false;
                break;
            }

            const operatorRequest = { or: [] };

            const queryBody = messageBody.query.childProcessesAnyInStep;

            childCellProcessDescriptors.forEach((childCellProcessDescriptor_) => {
                if (!Array.isArray(queryBody.apmStep)) {
                    operatorRequest.or.push({
                        CellProcessor: {
                            cell: {
                                cellCoordinates: childCellProcessDescriptor_.apmBindingPath,
                                query: {
                                    inStep: {
                                        apmStep: queryBody.apmStep
                                    }
                                }
                            }
                        }
                    });
                } else {
                    const suboperatorRequest = { or: [] };
                    queryBody.apmStep.forEach((stepName_) => {
                        suboperatorRequest.or.push({
                            CellProcessor: {
                                cell: {
                                    cellCoordinates: childCellProcessDescriptor_.apmBindingPath,
                                    query: {
                                        inStep: {
                                            apmStep: stepName_
                                        }
                                    }
                                }
                            }
                        });
                    });
                    operatorRequest.or.push(suboperatorRequest);
                }
            });

            const transitionRequest = {
                context: {
                    apmBindingPath: "~", // CellProcessor
                    ocdi: request_.context.ocdi,
                    transitionDispatcher: request_.context.transitionDispatcher
                },
                operatorRequest
            };

            const dispatchResponse = request_.context.transitionDispatcher.request(transitionRequest);
            if (dispatchResponse.error) {
                errors.push("Internal error dispatching synthesised suboperator request:");
                errors.push(dispatchResponse.error);
                break;
            }

            // Delegate.
            response = dispatchResponse.result.request(transitionRequest);
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
