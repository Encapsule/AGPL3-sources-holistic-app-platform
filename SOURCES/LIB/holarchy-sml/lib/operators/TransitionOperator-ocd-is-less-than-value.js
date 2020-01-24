
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id: "XxX_a1sQS1OlJbWAYfx6tQ",
    name: "OCD Namespace Is Less Than Value",
    description: "Returns Boolean true iff the indicated OCD namespace is less than the indicated value.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        isNamespaceLessThanValue: {
                            ____types: "jsObject",
                            path: {
                                ____accept: "jsString"
                            },
			    value: {
				____accept: [ "jsString", "jsNumber" ]
			    }
                        }
                    }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.operatorRequest.holarchy.sml.operators.ocd.isNamespaceLessThanValue;
            const rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: message.path
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const filterResponse = request_.context.ocdi.readNamespace(rpResponse.result);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            response.result = (filterResponse.result < message.value)?true:false;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
	}
        return response;
    }
});
