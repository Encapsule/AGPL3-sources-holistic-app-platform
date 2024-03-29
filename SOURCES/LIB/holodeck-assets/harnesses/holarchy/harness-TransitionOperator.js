
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id:"X2q-YtvCTrWx7csHq8R8Tw",
    name: "TransitionOperator Harness",
    description: "Constructs an instance of ES6 class TransitionOperator that is serialized and passed back as response.result.",

    // idempotent

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                TransitionOperator: {
                    ____types: "jsObject",
                    constructorRequest: {
                        // Either a TransitionOperator constructor request object or pre-constructed TransitionOperator instance reference
                        ____opaque: true
                    }
                }
            }
        }
    }, // testVectorRequestInputSpec

    testVectorResultOutputSpec: {
        ____accept: "jsObject" // TODO tighten this up
    }, // testVectorResultOutputSpec

    harnessBodyFunction: function(request_) {

        const messageBody = request_.vectorRequest.holistic.holarchy.TransitionOperator;

        // If we were not passed a pre-constructed TransitionOperator instance, then attempt to create a new instance with the constructorRequest.
        let transitionOperator = (messageBody.contructorRequest instanceof holarchy.TransitionOperator)?messageBody.contructorRequest:new holarchy.TransitionOperator(messageBody.constructorRequest);

        const response = {
            error: null,
            result: {
                isValid: transitionOperator.isValid(),
                toJSON: transitionOperator.toJSON()
            }
        };

        return response;

    } // harnessBodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
