// TransitionOperator-ocd-map-is-keyless

const TransitionOperator = require("../../../TransitionOperator");
const ObservableControllerData = require("../../../ObservableControllerData");

module.exports = new TransitionOperator({
    id: "fS5liuD1RBSdaPBEhsoxXw",

    name: "OCD Namespace Is Map Keyless",
    description: "Returns Boolean true iff the indicated OCD namespace is declared as a map in the OCD filter spec AND the OCD value is an object AND Object.key(value) !== 0.",
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
                        mapIsKeyless: {
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
            const message = request_.operatorRequest.holarchy.cm.operators.ocd.isMapKeyless;
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
            if (valueTypeString !== "[object Object]") {
                errors.push(`OCD path '${rpResponse.result}' is not an object. Check value type returned '${valueTypeString}'.`);
                break;
            }
            response.result = Object.keys(value).length === 0;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});
