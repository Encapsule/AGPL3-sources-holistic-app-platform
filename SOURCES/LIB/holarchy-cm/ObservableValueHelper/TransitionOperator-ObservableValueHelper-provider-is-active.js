// TransitionOperator-ObservableValueHelper-provider-is-active.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueHelper = require("./cmasObservableValueHelper");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Provider Is Active`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueHelper.mapLabels({ TOP: "providerIsActive" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the target ObservableValue cell's provider cell process is active.",
        operatorRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValueHelper: {
                            ____types: "jsObject",
                            providerIsActive: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString"
                                }
                            }
                        }
                    }
                }
            }
        },
        bodyFunction: function(operatorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValueHelper.providerIsActive;

                // Query the cell process step of the indicated ObservableValueHelper cell.
                let operatorRequest = {
                    ...operatorRequest_,
                    operatorRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: messageBody.path,
                                query: {
                                    inStep: {
                                        apmStep: "observable-value-helper-linked"
                                    }
                                }
                            }
                        }
                    }
                };

                let operatorResponse = operatorRequest_.context.transitionDispatcher.request(operatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }
                let operatorFilter = operatorResponse.result;
                response = operatorFilter.request(operatorRequest);


                /*

                // What is the apmBindingPath of the ObservableValueHelper cell to inspect?
                // Note that we're typically dispatched w/apmBindingPath set to the cellplane location of some active cell that owns the ObservableValueHelper cell of interest.

                let ocdResponse = holarchy.ObservableControllerData.dataPathResolve(
                    {
                        apmBindingPath: operatorRequest_.context.apmBindingPath, // The apmBindingPath of the cell that is or owns the ObservableValueHelper to inspect
                        dataPath: messageBody.path // Relative path from the owner cell to the included ObservableValueHelper cell. Note that if they're the same then, "#".
                    }
                );

                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                const ovhCellPath = ocdResponse.result; // The apmBindingPath of the ObservableValueHelper cell to inspect.

                // If the ObservableValueHelper cell's process is not in the "observable-value-helper-ready" step
                // then it has not been successfully configured and so it cannot be linked to an active "provider".

                const operatorRequest = {
                    context: {
                        apmBindingPath: ovhCellPath,
                        ocdi: operatorRequest_.context.ocdi,
                        transitionDispatcher: operatorRequest_.context.transitionDispatcher
                    },
                    operatorRequest: { CellProcessor: { cell: { query: { inStep: "observable-value-helper-ready" } } } },
                };

                let operatorResponse = operatorRequest_.context.transitionDispatcher.request(operatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }
                let operatorFilter = operatorResponse.result;
                response = operatorFilter.request(operatorRequest);

                let libResponse = lib.getStatus.request({ apmBindingPath: ovhPath, ocdi: operatorRequest_.context.ocdi });
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }
                const { cellMemory } = libResponse.result;

                // Let's be a bit overcautious here and really ensure that everything is in the state we expect.

                // We should have an active child process at predictable process coordinates. So, we should be able to read it's __apmiStep value w/out error...
                ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: cellMemory.observableValueWorkerProcess.apmBindingPath, dataPath: "#.__apmiStep" });
                if (ocdResponse.error) {
                    errors.push("INTERNAL ERROR: Unable to verify the existence of this ObservableValueHelper cell's ObservableValueWorker cell process instance!");
                    errors.push(ocdResponse.error);
                    break;
                }

                // ... And, the step value we read should make sense...
                const ovwStep = ocdResponse.result;
                if (ovwStep !== "observable-value-worker-ready") {
                    errors.push(`INTERNAL ERROR: We found our ObservableValueWorker cell process in step "${ovwStep}" but we expected it to be in step "observable-value-worker-ready" instead.`);
                    break;
                }

                // ... And, so that means that (by inference because the above shouldn't pass unless the worker proxy is "connected") that we should be able to ready the the provider cell process' __apmiStep w/out error...
                // CAN'T DO THIS RIGHT YET... ocdResponse = operatorRequest_.contexdt.ocdi.readNamespace({ apmBindingPath: cellMemory.configuration.observableValue.

                // v0.0.52-tourmaline --- I think the only way you can ever get Boolean false out of this operator
                // w/current implementation is activate the ObservableValueHelper cell (any way) w/out configuration data.
                // And, then call its configuration method in such a way that it reports response.error that you fail to
                // return via your own response.result (i.e. you drop don't check or otherwise drop the error). Otherwise,

                if (cellMemory.__apmiStep !== "observable-value-helper-ready") {
                    // There was some error applying configuration that prevented us from reaching our expected process step, "observable-value-helper-ready".
                    response.result = false;
                    break;
                }

                response.result = (cellMemory.__apmiStep === "observable-value-helper-ready");
                */


                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!operator.isValid()) { throw new Error(operator.toJSON()); }

    module.exports = operator;

})();

