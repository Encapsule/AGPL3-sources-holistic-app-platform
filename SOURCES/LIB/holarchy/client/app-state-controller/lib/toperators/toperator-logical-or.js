// sources/client/app-data-model/transition-operators/transition-operator-or-filter.js

const transitionOperatorFilterFactory = require('../app-state-controller-toperator-factory');

var factoryResponse = transitionOperatorFilterFactory.request({
    id:  "0JIva4IFSm6Xm7i38g8uUA",
    name: "OR Transition Expression Operator",
    description: "missing description",
    operatorFilterSpec: {
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
            if (!request_.operator.or.length) {
                errors.push("Cannot evaluate AND operation with zero operands.");
                break;
            }
            for (var operatorRequest of request_.operator.or) {
                var operatorResponse = request_.context.transitionOperatorsDiscriminator.request({
                    context: request_.context,
                    operator: operatorRequest
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
            response.error = errors.join(' ');
        return response;
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
