
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id: "mC3pPO5wS3SxvhgZgMjsJQ",
    name: "ObservableProcessModel Harness",
    description: "Constructs an instance of ES6 class ObservableProcessModel that is serialized and passed back as response.result.",

    // idempotent

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                ObservableProcessModel: {
                    ____types: "jsObject",
                    constructorRequest: {
                        ____opaque: true
                    }
                }
            }
        }
    }, // testVectorRequestInputSpec

    testVectorResultOutputSpec: {
        ____accept: "jsObject" // TODO: Tighten this up
    }, // testVectorResultOutputSpec

    harnessBodyFunction: function(request_) {

        const messageBody = request_.vectorRequest.holistic.holarchy.ObservableProcessModel;
        const observableProcessModel = new holarchy.ObservableProcessModel(messageBody.constructorRequest);

        const response = {
            error: null,
            result: {
                isValid: observableProcessModel.isValid(),
                toJSON: observableProcessModel.toJSON()
            }
        };

        return response;

    } // harnessBodyFunction

});

if (factoryResponse.error) {
    throw new Erorr(factoryResponse.error);
}

module.exports = factoryResponse.result;



