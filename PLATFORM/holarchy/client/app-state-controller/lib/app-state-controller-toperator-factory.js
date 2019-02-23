// transition-operator-filter-factory.js

const arccore = require("arccore");

var factoryResponse = arccore.filter.create({
    operationID: "-99RI_6HTsiQgwN2OV1xXQ",
    operationName: "Transition Operator Filter Factory",
    operationDescription: "Constructs a controller state transition operator filter.",
    inputFilterSpec: {
        ____label: "Filter Factory Request",
        ____types: "jsObject",
        id: { ____accept: "jsString" },
        name: { ____accept: "jsString" },
        description: { ____accept: "jsString" },
        operatorFilterSpec: { ____accept: "jsObject" },
        bodyFunction: { ____accept: "jsFunction" }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var innerFactoryResponse = arccore.filter.create({
                operationID: request_.id,
                operationName: request_.name,
                operationDescription: request_.description,
                inputFilterSpec: {
                    ____label: request_.name + " Request",
                    ____types: "jsObject",
                    context: {
                        ____types: "jsObject",
                        appStateModel: {
                            ____accept: "jsObject"
                        },
                        appDataStore: {
                            ____accept: "jsObject"
                        },
                        transitionOperatorsDiscriminator: {
                            ____accept: "jsObject"
                        }
                    },
                    operator: request_.operatorFilterSpec
                },
                bodyFunction: request_.bodyFunction,
                outputFilterSpec: { ____accept: "jsBoolean" }
            });
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    },
    outputFilterSpec: {
        ____label: "Transition Operator Filter",
        ____accept: "jsObject"
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
