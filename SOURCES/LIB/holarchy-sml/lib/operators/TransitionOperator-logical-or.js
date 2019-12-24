
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id:  "0JIva4IFSm6Xm7i38g8uUA",
    name: "OR Transition Expression Operator",
    description: "Returns Boolean true iff any suboperations return true.",
    operatorRequestSpec: {
        ____types: "jsObject",
        or: {
            ____types: "jsArray",
            operandOperatorVariant: {
                ____accept: "jsObject"
            }
        }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (!request_.operatorRequest.or.length) {
                errors.push("Cannot evaluate OR operation with zero operands.");
                break;
            }
            for (var operatorRequest of request_.operatorRequest.or) {
                var operatorResponse = request_.context.transitionDispatcher.request({
                    context: request_.context,
                    operatorRequest: operatorRequest
                });
                if (operatorResponse.error) {
                    errors.push("In transition operator AND attempting to process operatorRequest='" + JSON.stringify(operatorRequest) + "':");
                    errors.push(operatorResponse.error);
                    break;
                }
                if (operatorResponse.result) {
                    response.result = true;
                    break;
                }
            }
            if (errors.length)
                break;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }
});
