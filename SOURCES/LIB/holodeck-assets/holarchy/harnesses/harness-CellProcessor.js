
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id: "UBSclp3gSqCCmSvoG3W4tw",

    name: "CellProcessor Harness",
    description: "Constructs an instance of ES6 class CellProcessor and serializes it for inspection. There's a lot more we plan to do with this later.",
    harnessOptions: { idempotent: true },
    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                CellProcessor: {
                    ____types: "jsObject",
                    constructorRequest: {
                        // CellProcessor constructor request object or pre-constructed CellProcessor class instance reference.
                        ____opaque: true // accept any request and let CellModel sort it out
                    },
                    actRequests: {
                        ____types: "jsArray",
                        ____defaultValue: [],
                        actRequest: {
                            ____opaque: true // accept any request and let OPC sort it out
                        }
                    }
                }
            }
        }
    },
    testVectorResultOutputSpec: {
        ____types: "jsObject",
        isValid: { ____accept: "jsBoolean" },
        cpJSON: {
            ____accept: [
                "jsString", // The instance is invalid and this is this._private.constructorError string.
                "jsObject",  // The instance is valid and this is this._private object.
            ]
        },
        actionEvaluations: {
            ____label: "Post Action State",
            ____types: "jsArray",
            ____defaultValue: [],
            evaluationResponse: {
                ____types: "jsObject",
                actRequest: {
                    ____accept: "jsObject"
                },
                actResponse: {
                    ____types: "jsObject",
                    error: {
                        ____accept: [ "jsNull", "jsString" ]
                    },
                    result: {
                        ____opaque: true
                    }
                }
            }
        }
    },
    harnessBodyFunction: (vectorRequest_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {

            inBreakScope = true;

            response.result = {
                phase1: []
            };

            const messageBody = vectorRequest_.vectorRequest.holistic.holarchy.CellProcessor;

            const cpInstance = (messageBody.constructorRequest instanceof holarchy.CellProcessor)?messageBody.constructorRequest:new holarchy.CellProcessor(messageBody.constructorRequest);

            let cpToJSON = JSON.parse(JSON.stringify(cpInstance));

            // TODO: Filter non-idempotent info out of the cpToJSON payload written to holdeck 1 eval logs.

            response.result = {
                isValid: cpInstance.isValid(),
                cpJSON: cpToJSON,
                actResponse: []
            };

            messageBody.actRequests.forEach((actRequest_) => {

                delete cpInstance._private.opc._private.lastEvaluationResponse; // why? I got this from OPC test harness. Need to look into this...

                if (!cpInstance.isValid()) {
                    response.result.actionEvaluations.push({
                        actRequest: actRequest_,
                        actResponse: { error: "CellProcessor instance is invalid!" }
                    });
                    return;
                }

                let actResponse = cpInstance.act(actRequest_);

                response.result.actionEvaluations.push({
                    actRequest: actRequest_,
                    actResponse: actResponse
                });

            });

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
