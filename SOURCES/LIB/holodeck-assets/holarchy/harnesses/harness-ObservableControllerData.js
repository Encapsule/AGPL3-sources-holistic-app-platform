
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id: "7JFMyzm-T9aUv-ULeN_3FQ",
    name: "ObservableControllerData Harness",
    description: "Constructs an instance of ES6 class ObservableControllerData upon which a test author can subsequently execute method calls to test low-level OCD functionality.",

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                ObservableControllerData: {
                    ____types: "jsObject",
                    constructorRequest: {
                        ____opaque: true
                    },
                    methodCalls: {
                        ____types: "jsArray",
                        ____defaultValue: [],
                        methodCallDescriptor: {
                            ____types: "jsObject",
                            methodName: { ____accept: "jsString" },
                            argv: {
                                ____accept: "jsArray",
                                ____defaultValue: []
                            }
                        }
                    }
                }
            }
        }
    },

    testVectorResultOutputSpec: {
        ____accept: "jsObject" // TODO
    },

    harnessBodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const messageBody = request_.vectorRequest.holistic.holarchy.ObservableControllerData;
            const ocdi = (messageBody.constructorRequest instanceof holarchy.ObservableControllerData)?messageBody.constructorRequest:new holarchy.ObservableControllerData(messageBody.constructorRequest);
            response.result = {
                construction: {
                    isValid: ocdi.isValid(),
                    toJSON: ocdi.toJSON()
                }
            };
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

