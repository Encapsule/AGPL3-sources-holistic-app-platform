// sources/client/app-data-model/transition-operators/transition-operator-and-filter.js

const transitionOperatorFilterFactory = require("../app-state-controller-toperator-factory");

var factoryResponse = transitionOperatorFilterFactory.request({
    id: "YgABX95wR86GCYrYaDLISA",
    name: "AND Transition Expression Operator",
    description: "missing description",
    operatorFilterSpec: {
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
                var operatorResponse = request_.context.transitionOperatorsDiscriminator.request({
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

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
