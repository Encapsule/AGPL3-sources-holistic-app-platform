// TransitionOperator-ObservableValueHelper-value-is-available.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Is Available`;
    const lib = require("./lib");

    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, TOP: "valueIsAvailable" }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true if the target ObservableValue cell's value has been written at least once by its provider cell process.",
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
                            valueIsAvailable: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
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

                // TODO: This is a useful pattern. We should make it generically re-usable somehow. But, not today ;-)

                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValueHelper.valueIsAvailable;

                let suboperatorRequest = {
                    ...operatorRequest_,
                    operatorRequest: { holarchy: { common: { operators: { ObservableValueHelper: { isLinked: { path: messageBody.path } } } } } }
                };

                let operatorResponse = operatorRequest_.context.transitionDispatcher.request(suboperatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }
                let operatorFilter = operatorResponse.result;
                operatorResponse = operatorFilter.request(suboperatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }

                if (!operatorResponse.result) {
                    response.result = false;
                    break;
                }

                let ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.observableValueWorkerProcess.apmBindingPath` });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const ovwProcessCoordinates = ocdResponse.result;

                suboperatorRequest = {
                    context: {
                        ...operatorRequest_.context,
                        apmBindingPath: ovwProcessCoordinates
                    },
                    operatorRequest: { holarchy: { common: { operators: { ObservableValueWorker: { _private: { valueIsAvailable: { } } } } } } }
                };

                operatorResponse = operatorRequest_.context.transitionDispatcher.request(suboperatorRequest);
                if (operatorResponse.error) {
                    errors.push(operatorResponse.error);
                    break;
                }
                operatorFilter = operatorResponse.result;

                operatorResponse = operatorFilter.request(suboperatorRequest);
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

