// TransitionOperator-ocd-array-is-empty.js

const TransitionOperator = require("../../../../TransitionOperator");
const ObservableControllerData = require("../../../ObservableControllerData");

module.exports = new TransitionOperator({
    id: "pj9a6tQpSXWp7WZZ8VbKLQ",
    name: "OCD Namespace Is Array Empty",
    description: "Returns Boolean true iff the indicated OCD namespace value is an array AND value.length !== 0.",
    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            cm: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        arrayIsEmpty: {
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
    bodyFunction: function(request_) {
        let response = { error: null, result: false };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.operatorRequest.holarchy.cm.operators.ocd.isArrayEmpty;
            const rpResponse = ObservableControllerData.dataPathResolve({ dataPath: message.path, apmBindingPath: request_.context.apmBindingPath });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const path = rpResponse.result;
            var filterResponse = request_.context.ocdi.readNamespace(path);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const value = filterResponse.result;
            const valueTypeString = Object.prototype.toString.call(value);
            if (valueTypeString !== "[object Array]") {
                errors.push(`OCD path '${rpResponse.result}' is not an array. Check value type returned '${valueTypeString}'.`);
                break;
            }
            response.result = value.length === 0;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
