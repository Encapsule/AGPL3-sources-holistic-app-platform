
const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");


const factoryResponse = holodeck.harnessFactory.request({
    id: "54MiSgQdSiukMX4fIZJimg",
    name: "ObservableProcessControler Harness",
    description: "Constructs an instance of ES6 class ObservableProcessController, serializes it, and then executes some number of serialized act calls.",

    harnessOptions: { idempotent: true },

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                ObservableProcessController: {
                    ____types: "jsObject",
                    constructorRequest: {
                        ____opaque: true // accept any request and let OPC sort it out
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
        opcToJSON: {
            ____label: "Post-Construction State",
            ____accept: "jsObject"
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

    harnessBodyFunction: function(request_) {

        const messageBody = request_.vectorRequest.holistic.holarchy.ObservableProcessController;

        let response = {
            error: null,
            result: {
                opcToJSON: null,
                actionEvaluations: []
            }
        };

        const opcInstance = new holarchy.ObservableProcessController(messageBody.constructorRequest);

        const toJSON = opcInstance.toJSON();

        // TODO: Again - arccore.util.deepCopy/clone is proving to
        // be problematic. The intended contract of this export function
        // is very permissive - it should make a deep copy of whatever
        // you pass to it. Instead, here is a case that causes an exception.
        // This is concerning as the input request is a serialization object
        // derived from an OPC instance. We know that OPC.toJSON is currently
        // not really legitimate --- it's purpose is to allow a developer
        // to suspend a system of observable processes which implies a variant
        // contructor function (not supported currently). It's probably a reasonable
        // idea to immediately add ObservableProcessController._getTestData in
        // order to avoid taking a dependency on toJSON. This way we can later
        // fix toJSON to work as intended w/out breaking existing tests.

        // THIS IS CRAP >>>> const serialized = arccore.util.deepCopy(toJSON);

        const serialized = JSON.parse(JSON.stringify(toJSON));

        // Let's just delete the known non-idempotent (i.e. volatile) timing information
        // and iid information in order to treat this as an idempotent test case.

        delete serialized.iid;
        if (serialized.lastEvalResponse && !serialized.lastEvalResponse.error) {
            delete serialized.lastEvalResponse.result.summary.evalStopwatch;
        }

        response.result.opcToJSON = serialized;

        // Dispatch act requests. Note we don't care about the object status. If the opci is invalid, then the logs will be full of errors.
        messageBody.actRequests.forEach((actRequest_) => {

            // TODO: FIX THIS: This is a bug in OPC.act
            delete opcInstance._private.lastEvalautionRepsonse;

            let actResponse = opcInstance.act(actRequest_);
            if (!actResponse.error) {
                delete actResponse.result.summary.evalStopwatch;
            } else {
                // TODO: FIX THIS: Depending on how act fails
                // it probably doesn't make sense to return last evaluation response in all cases (like this one).
                delete actResponse.result;
            }

            response.result.actionEvaluations.push({
                actRequest: actRequest_,
                actResponse: actResponse
            });

        });

        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
