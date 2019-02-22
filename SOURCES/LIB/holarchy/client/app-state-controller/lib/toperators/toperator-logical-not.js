// sources/client/app-data-model/transition-operators/transition-operator-not-filter.js

const transitionOperatorFilterFactory = require('../app-state-controller-toperator-factory');

var factoryResponse = transitionOperatorFilterFactory.request({
    id:  "TLSHkl73SO-utuzM7dyN2g",
    name: "NOT Transition Expression Operator",
    description: "Input negation operator.",
    operatorFilterSpec: {
        ____types: "jsObject",
        not: {
            ____accept: "jsObject"
        }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: true };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var operatorResponse = request_.context.transitionOperatorsDiscriminator.request({
                context: request_.context,
                operator: request_.operator.not
            });
            if (operatorResponse.error) {
                errors.push("In transition operator NOT process operatorRequest='" + JSON.stringify(request_.operator.not) + "':");
                errors.push(operatorResponse.error);
                break;
            }
            if (operatorResponse.result) {
                response.result = false;
                break;
            }
        }
        if (errors.length)
            response.error = errors.join(' ');
        return response;
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
