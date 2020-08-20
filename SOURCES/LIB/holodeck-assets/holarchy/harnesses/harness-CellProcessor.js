
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
                },
                ocdJSON: { ____accept: [ "jsUndefined", "jsObject" ] }
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

            let serialized = JSON.parse(JSON.stringify(cpInstance));

            // Remove non-idempotent information from the serialized OPC object.
            if (cpInstance.isValid()) {

                delete serialized.opc.iid;
                if (serialized.opc.lastEvalResponse && serialized.opc.lastEvalResponse.result) {
                    delete serialized.opc.lastEvalResponse.result.summary.evalStopwatch;
                }

            }

            response.result = {
                isValid: cpInstance.isValid(),
                cpJSON: serialized,
                actionEvaluations: []
            };

            messageBody.actRequests.forEach((actRequest_) => {

                if (!cpInstance.isValid()) {
                    response.result.actionEvaluations.push({
                        actRequest: actRequest_,
                        actResponse: { error: "CellProcessor instance is invalid!" }
                    });
                    return;
                }

                delete cpInstance._private.opc._private.lastEvaluationResponse; // why? I got this from OPC test harness. Need to look into this...

                let actResponse = cpInstance.act(actRequest_);

                // Filter non-idempotent information out of the actResponse object.

                if (!actResponse.error) {
                    delete actResponse.result.lastEvaluation.summary.evalStopwatch;
                }

                response.result.actionEvaluations.push({
                    actRequest: actRequest_,
                    actResponse: actResponse,
                    ocdJSON: JSON.parse(JSON.stringify(cpInstance._private.opc._private.ocdi._private.storeData))
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
