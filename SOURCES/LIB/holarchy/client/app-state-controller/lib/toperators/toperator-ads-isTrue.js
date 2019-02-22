// sources/client/app-data-model/transition-operators/transition-operator-isTrue-filter.js

const transitionOperatorFilterFactory = require("../app-state-controller-toperator-factory");
const getNamespaceInReferenceFromPath = require("../../../../common/data/get-namespace-in-reference-from-path");

var factoryResponse = transitionOperatorFilterFactory.request({
    id: "8Bqeg7xtT62Dt1Robt8K7Q",
    name: "isTrue Transition Expression Operator",
    description: "missing description",
    operatorFilterSpec: {
        ____types: "jsObject",
        isTrue: { ____accept: "jsString" }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: request_.operator.isTrue,
                sourceRef: request_.context.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            if (innerResponse.result === true)
                response.result = true;
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
