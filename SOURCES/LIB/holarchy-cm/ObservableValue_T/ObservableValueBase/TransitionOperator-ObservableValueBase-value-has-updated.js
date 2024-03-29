// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Value Has Updated`;

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueBase.mapLabels({ CM: cmLabel, TOP: operatorName }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true iff the ObservableValue cell's value has been written (updated) since the last time a specific observer (the caller of the this operator) queried the ObservableValue for update(s).",
        operatorRequestSpec: {
            ____label: "ObservableValue Value Has Updated Operator Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValue: {
                            ____types: "jsObject",
                            valueHasUpdated: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                },
                                lastReadRevision: {
                                    ____label: "ObservableValue Observer Revision",
                                    ____description: "The last revision of this ObservableValue cell's value that was read by the requesting observer cell.",
                                    ____accept: "jsNumber",
                                    ____defaultValue: -1
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
                console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] called on provider cell "${operatorRequest_.context.apmBindingPath}"`);
                const messageBody = operatorRequest_.operatorRequest.holarchy.common.operators.ObservableValue.valueHasUpdated;
                // Check to see if there's a pending dact. If there is, then the answer is yes --- the value has updated (or it will when read).
                let ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.dact` });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const dact = ocdResponse.result;
                if (dact) {
                    response.result = true;
                } else {
                    // Attempt to read the ObservableValue's current revision number. Note that failure here indicates that the ObservableValue is not active (and that possibly the provider cell process itself is not active).
                    ocdResponse = operatorRequest_.context.ocdi.readNamespace({ apmBindingPath: operatorRequest_.context.apmBindingPath, dataPath: `${messageBody.path}.revision` });
                    if (ocdResponse.error) {
                        // Either the provider cell process or the ObservableValue cell process is not active. So, the answer is false --- the ObservableValue is not available.
                        response.result = false;
                        break;
                    }
                    const currentRevision = ocdResponse.result;
                    // We get activated w/default revision === -1.
                    // And, and ObservableValueWorker cell gets activated w/default lastReadRevision === -2.
                    // So, if we're -1 (not available) and the ObservableValueWorker has never read (-2) or read
                    // a unavailable value (-1) the answer is no, the value has not updated.
                    if ((currentRevision < 0) && (messageBody.lastReadRevision < 0)) {
                        response.result = false;
                        break;
                    }
                    response.result = (currentRevision !== messageBody.lastReadRevision);
                } // else
                console.log(`> Answer is ${response.result} --- value cell ${response.result?"UPDATED":"not updated"} since last read.`);
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    });

    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }

    module.exports = operator;

})();

