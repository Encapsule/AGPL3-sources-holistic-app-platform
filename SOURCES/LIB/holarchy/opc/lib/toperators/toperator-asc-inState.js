// sources/client/app-data-model/transition-operators/transition-operator-inState-filter.js

const transitionOperatorFilterFactory = require("../app-state-controller-toperator-factory");

var factoryResponse = transitionOperatorFilterFactory.request({
    id: "sHBZOTIQTZ61AHfwgUVJ3Q",
    name: "inState Transition Expression Operator",
    description: "missing desciption",
    operatorFilterSpec: {
        ____types: "jsObject",
        inState: { ____accept: "jsString" }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var args = request_.operator.inState.split(":");
            if (args.length !== 2) {
                errors.unshift("Invalid subcontroller:state refernce specified.");
                break;
            }
            var subcontrollerInfo = request_.context.appStateModel.controllerMap[args[0]];
            if (subcontrollerInfo === undefined) {
                errors.unshift("Invalid reference to unknown subcontroller name '" + args[0] + "'.");
                break;
            }
            response.result = subcontrollerInfo.state === args[1];
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
