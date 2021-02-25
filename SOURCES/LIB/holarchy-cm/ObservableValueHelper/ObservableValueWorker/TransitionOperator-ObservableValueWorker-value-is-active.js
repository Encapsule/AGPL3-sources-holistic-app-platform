// TransitionOperator-ObsevableValueWorker-value-is-active.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueWorker = require("./cmasObservableValueWorker");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Is Active`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueWorker.mapLabels({ TOP: "valueIsActive" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the target ObservableValue cell is active.",
        operatorRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValueWorker: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                valueIsActive: {
                                    ____types: "jsObject"
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
                let ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: "#.__apmiStep"});
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmiStep = ocdResponse.result;
                if (apmiStep !== "observable-value-worker-proxy-connected") {
                    response.result = false;
                    break;
                }
                ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: "#.ovCell.path"});
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const ovPath = ocdResponse.result;
                // Now, actually verify the existence of the ObservableValue cell.
                const operatorRequest = {
                    ...operatorRequest_,
                    operatorRequest: {
                        CellProcessor: {
                            cell: {
                                cellCoordinates: "#.ovcpProviderProxy",
                                delegate: {
                                    operatorRequest: {
                                        holarchy: {
                                            CellProcessProxy: {
                                                proxy: {
                                                    operatorRequest: {
                                                        holarchy: {
                                                            common: {
                                                                operators: {
                                                                    ObservableValue: {
                                                                        valueIsActive: {
                                                                            path: ovPath
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
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
                const operatorFilter = operatorResponse.result;
                operatorResponse = operatorFilter.request(operatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
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

    if (!operator.isValid()) { throw new Error(operator.toJSON()); }

    module.exports = operator;



})();

