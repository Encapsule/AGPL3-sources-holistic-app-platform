
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id: "YgABX95wR86GCYrYaDLISA",
    name: "AND Transition Expression Operator",
    description: "Returns Boolean true iff all suboperations return true.",
    operatorRequestSpec: {
        ____types: "jsObject",
        and: {
            ____types: "jsArray",
            operandOperatorVariant: {
                ____accept: "jsObject"
            }
        }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: true };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (!request_.operator.and.length) {
                errors.push("Cannot evaluate AND operation with zero operands.");
                break;
            }
            for (var operatorRequest of request_.operator.and) {
                var operatorResponse = request_.context.transitionDispatcher.request({
                    context: request_.context,
                    operator: operatorRequest
                });
                if (operatorResponse.error) {
                    errors.push("In transition operator AND attempting to process operatorRequest='" + JSON.stringify(operatorRequest) + "':");
                    errors.push(operatorResponse.error);
                    break;
                }
                if (!operatorResponse.result) {
                    response.result = false;
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
