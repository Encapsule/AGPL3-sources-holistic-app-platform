
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id:"ggsavKiARsq7rjwn-lxdfA",
    name: "OCD Namespace Is Greater Than Value",
    description: "Returns Boolean true iff the indicated OCD namespace is greater than the indicated value. Limited to number and string value comparisons only.",

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
                        isNamespaceGreaterThanValue: {
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
            const message = request_.operatorRequest.holarchy.sml.operators.ocd.isNamespaceGreaterThanValue;
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
	    // TODO: It would be better to also confirm that both values are the same type.
            response.result = (filterResponse.result > message.value);
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
	}
        return response;
    }
});