// TransitionOperator-cpm-parent-process-in-step.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const ObservableControllerData = require("../../../lib/ObservableControllerData");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");
const cpmApmBindingPath = `~.${cpmMountingNamespaceName}`;
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

module.exports = new TransitionOperator({
    id: "PHPSWivjRyK80Gtymsp-pA",
    name: "Cell Process Manager: Parent Process In Step",
    description: "Returns Boolean true request.context.apmBindingPath is a cell process whose parent cell process is in the specified process step.",
    operatorRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            cell: {
                ____types: "jsObject",
                cellCoordinates: {
                    ____types: [
                        // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell.
                        // Or, an IRUT that resolves to a known cellProcessID (that by definition must resolve to an active cell).
                        "jsString",
                        // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                        "jsObject",
                    ],
                    ____defaultValue: "#",
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }

                },
                query: {
                    ____types: "jsObject",
                    filterBy: cellProcessQueryRequestFilterBySpec,
                    parentProcessInStep: {
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

            // Get the parent process descriptor.
            cpmLibResponse = cpmLib.getProcessParentDescriptor.request({
                cellProcessID: prologueData.resolvedCellCoordinates.cellPathID,
                filterBy: messageBody.query.filterBy,
                ocdi: request_.context.ocdi,
                treeData: prologueData.ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const parentCellProcessDescriptor = cpmLibResponse.result;

            if (parentCellProcessDescriptor.apmBindingPath === "~") {
                // Note that we make it appear that the CPM is bound to ~. But, it's not.
                parentCellProcessDescriptor.apmBindingPath = cpmApmBindingPath;
            }

            response.result = parentCellProcessDescriptor.apmBindingPath?true:false;

            const operatorRequest = {};

            const queryBody = messageBody.query.parentProcessInStep;

            if (!Array.isArray(queryBody.apmStep)) {
                operatorRequest.holarchy = {
                    cm: {
                        operators: {
                            cell: {
                                atStep: {
                                    step: queryBody.apmStep,
                                    path: parentCellProcessDescriptor.apmBindingPath
                                }
                            }
                        }
                    }
                };
            } else {
                operatorRequest.or = [];
                queryBody.apmStep.forEach((stepName_) => {
                    operatorRequest.or.push({
                        holarchy: {
                            cm: {
                                operators: {
                                    cell: {
                                        atStep: {
                                            step: stepName_,
                                            path: parentCellProcessDescriptor.apmBindingPath
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            }

            const transitionRequest = {
                context: {
                    apmBindingPath: "~",
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
