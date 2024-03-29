// TransitionOperator-cpm-ancestor-processes-all-in-step.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");
const cpmApmBindingPath = `~.${cpmMountingNamespaceName}`;
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

const transitionOperator = new TransitionOperator({
    id: "6j5F3HmKTLG9Q8kD1-QWYA",
    name: "Cell Process Manager: Ancestor Processes All In Step",
    description: "Returns Boolean true if request.context.apmBindingPath is a cell process with ancestor process(es) all in the specified process step(s).",

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
                    ancestorProcessesAllInStep: {
                        ____types: "jsObject",
                        apmStep: {
                            // If apmStep is a single step name (string) then all child cell processes must be in that step.
                            // If apmStep is an array of step names (strings), then all child cell processes must be in any of the indicated steps.
                            ____types: [ "jsString", "jsArray" ],
                            stepName: { ____accept: "jsString" }
                        },
                        omitCellProcessor: {
                            ____label: "Omit CellProcessor",
                            ____description: "Exclude the CellProcessor's Cell Process Manger process step.",
                            ____accept: "jsBoolean",
                            ____defaultValue: true
                        }
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

            // This is all we can ever be 100% sure about based on the apmBindingPath.
            if (request_.context.apmBindingPath === "~") {
                break; // response.result === false
            }

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

            cpmLibResponse = cpmLib.getProcessAncestorDescriptors.request({
                cellProcessID: prologueData.resolvedCellCoordinates.cellPathID,
                filterBy: messageBody.query.filterBy,
                ocdi: request_.context.ocdi,
                treeData: prologueData.ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            // By definition there's always at least one ancestor descriptor.
            const ancestorCellProcessDescriptors = cpmLibResponse.result;

            const operatorRequest = { and: [] };

            const queryBody = messageBody.query.ancestorProcessesAllInStep;

            ancestorCellProcessDescriptors.forEach((ancestorCellProcessDescriptor_) => {
                // Alias the anonymous root namespace to the Cell Process Manger (CPM).
                if (ancestorCellProcessDescriptor_.apmBindingPath === "~") {
                    if (queryBody.omitCellProcessor) {
                        return;
                    }
                    ancestorCellProcessDescriptor_.apmBindingPath = cpmApmBindingPath;
                }

                if (!Array.isArray(queryBody.apmStep)) {
                    operatorRequest.and.push({
                        CellProcessor: {
                            cell: {
                                cellCoordinates:  ancestorCellProcessDescriptor_.apmBindingPath,
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
                        subOperatorRequest.or.push({
                            CellProcessor: {
                                cell: {
                                    cellCoordinates: ancestorCellProcessDescriptor_.apmBindingPath,
                                    query: {
                                        inStep: {
                                            apmStep: stepName_
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

if (!transitionOperator.isValid()) {
    throw new Error(transitionOperator.toJSON());
}

module.exports = transitionOperator;
