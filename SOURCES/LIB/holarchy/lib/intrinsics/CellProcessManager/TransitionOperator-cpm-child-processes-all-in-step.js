// TransitionOperator-cpm-child-processes-all-in-step.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../TransitionOperator");

module.exports = new TransitionOperator({
    id: "5P2MHjL4TXCqScp_xNrJyA",
    name: "Cell Process Manager: Child Processes All In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process whose child processes are all in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                childProcessesAllInStep: {
                    ____types: "jsObject",
                    apmStep: {
                        // If apmStep is a single step name (string) then all child cell processes must be in that step.
                        // If apmStep is an array of step names (strings), then all child cell processes must be in any of the indicated steps.
                        ____types: [ "jsString", "jsArray" ],
                        stepName: { ____accept: "jsString" }
                    }
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

            const message = request_.operatorRequest.holarchy.CellProcessor.childProcessesAllInStep;

            let cpmLibResponse = cpmLib.getProcessTreeData({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cellProcessTreeData = cpmLibResponse.result;
            cpmLibResponse = cpmLib.getProcessChildrenDescriptors({
                cellProcessID: arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result,
                treeData: cellProcessTreeData
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

            const operatorRequest = { and: [] };

            childCellProcessDescriptors.forEach((childCellProcessDescriptor_) => {
                if (!Array.isArray(message.apmStep)) {
                    operatorRequest.and.push({
                        holarchy: {
                            cm: {
                                operators: {
                                    cell: {
                                        atStep: {
                                            step: message.apmStep,
                                            path: childCellProcessDescriptor_.apmBindingPath
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
                                                path: childCellProcessDescriptor_.apmBindingPath
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    });
                    operatorRequest.and.push(suboperatorRequest);
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
