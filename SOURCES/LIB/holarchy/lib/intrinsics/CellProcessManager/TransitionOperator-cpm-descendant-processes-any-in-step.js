// TransitionOperator-cpm-descendant-process-in-step.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

module.exports = new TransitionOperator({
    id:     "DzlsRZBOReO03GSPsU3CIg",
    name: "Cell Process Manager: Descendant Processes Any In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process whose descendant cell processes contain any cell process(es) in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                descendantProcessesAnyInStep: {
                    ____types: "jsObject",
                    apmStep: {
                        // If apmStep is a single step name (string) then all child cell processes must be in that step.
                        // If apmStep is an array of step names (strings), then all child cell processes must be in any of the indicated steps.
                        ____types: [ "jsString", "jsArray" ],
                        stepName: { ____accept: "jsString" }
                    },
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

            const message = request_.operatorRequest.holarchy.CellProcessor.descendantProcessesAnyInStep;

            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;

            cpmLibResponse = cpmLib.getProcessDescendantDescriptors.request({
                cellProcessID: arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result,
                filterBy: message.filterBy,
                ocdi: request_.context.ocdi,
                treeData: ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const descendantCellProcessDescriptors = cpmLibResponse.result;

            if (!descendantCellProcessDescriptors.length) {
                break;
            }

            const operatorRequest = { or: [] };

            descendantCellProcessDescriptors.forEach((descendantCellProcessDescriptor_) => {
                if (!Array.isArray(message.apmStep)) {
                    operatorRequest.or.push({
                        holarchy: {
                            cm: {
                                operators: {
                                    cell: {
                                        atStep: {
                                            step: message.apmStep,
                                            path: descendantCellProcessDescriptor_.apmBindingPath
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else {
                    const suboperatorRequest = { or: [] };
                    message.apmStep.forEach((stepName_) => {
                        subOperatorRequest.or.push({
                            holarchy: {
                                cm: {
                                    operators: {
                                        cell: {
                                            atStep: {
                                                step: stepName_,
                                                path: descendantCellProcessDescriptor_.apmBindingPath
                                            }
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

