
const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

(function() {

    const testActorRequestSpec = {
        ____types: "jsObject",
        ____defaultValue: {},
        actRequest: { ____opaque: true },
        options: {
            ____types: "jsObject",
            ____defaultValue: {},
            failTestIf: {
                ____types: "jsObject",
                ____defaultValue: {},
                CellProcessor: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    actionError: {
                        ____types: "jsString",
                        ____inValueSet: [ "ignore-never-fail", "fail-if-action-error", "fail-if-action-result" ],
                        ____defaultValue: "fail-if-action-error"
                    },
                    evaluateError: {
                        ____types :"jsObject",
                        ____defaultValue: {},
                        opcErrors: {
                            ____types: "jsString",
                            ____inValueSet: [ "ignore-never-fail", "fail-if-opc-has-errors", "fail-if-opc-no-errors" ],
                            ____defaultValue: "fail-if-opc-has-errors"
                        }
                    }
                }
            }
        }
    };

    let factoryResponse = arccore.filter.create({
        operationID: "9gUMmp5ASferLwmp23OSZQ",
        operationName: "Make testActorRequest Filter",
        operationDescription: "A filter used to create a testActorRequest object.",
        inputFilterSpec: testActorRequestSpec
    });
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    const makeTestActorRequestFilter = factoryResponse.result;

    factoryResponse = makeTestActorRequestFilter.request();
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    const defaultTestActorRequest = factoryResponse.result;

    factoryResponse = holodeck.harnessFactory.request({
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
                        // NEW: Use instead of actRequest as needed to gain access to test failure overrides.
                        // If you're writing your tests correctly w/both positive and negative test cases
                        // (i.e. you're checking that what should succeed does. And, what should return an error does)
                        // then you'll need to adjust the test failure options in order avoid a build-breaking non-zero exit
                        // code from holodeck OS process.

                        testActorRequests: {
                            ____types: "jsArray",
                            ____defaultValue: [],
                            testActorRequest: testActorRequestSpec,
                        },

                        // Deprecated in favor of new testActorRequests.
                        // actRequests is left as-is so as not to destabilize existing tests.
                        // However, all legacy tests are executed w/default (i.e. very strict)
                        // test failure check options. To relax these, you must use testActorRequests
                        // that allows you to override the test failure default options per-request.
                        actRequests: {
                            ____types: "jsArray",
                            ____defaultValue: [],
                            actRequest: {
                                ____opaque: true // accept any request and let OPC sort it out
                            }
                        },
                        // ^--- Deprecated. Migrate to testActorRequests.
                        options: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            failTestIf: {
                                ____label: "Fail Test If...",
                                ____description: "Flags that override the default behaviors of the CellProcessor test harness.",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                CellProcessor: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    instanceValidity: {
                                        ____types: "jsString",
                                        ____inValueSet: [
                                            "ignore-never-fail",
                                            "fail-if-instance-invalid",
                                            "fail-if-instance-valid"
                                        ],
                                        ____defaultValue: "fail-if-instance-invalid"
                                    },
                                    validInstanceHasOPCWarnings: {
                                        ____accept: "jsString",
                                        ____inValueSet: [
                                            "ignore-never-fail",
                                            "fail-if-opc-has-warnings",
                                            "fail-if-opc-no-warnings"
                                        ],
                                        ____defaultValue: "fail-if-opc-has-warnings"
                                    }, // opcWarning
                                    validInstanceHasOPCErrors: {
                                        ____accept: "jsString",
                                        ____inValueSet: [
                                            "ignore-never-fail",
                                            "fail-if-opc-has-errors",
                                            "fail-if-opc-no-errors"
                                        ],
                                        ____defaultValue: "fail-if-opc-has-errors"
                                    } // cellEvaluation
                                }
                            }
                        }
                    }
                }
            }
        },
        testVectorResultOutputSpec: {
            ____types: "jsObject",
            vectorFailed: { // the CellProcessor harness sets this true if it decides that this vector has gone vectored off the rail based on default options and overrides if specified in vectorRequest
                ____accept: "jsBoolean",
                ____defaultValue: false
            },
            construction: {
                ____types: "jsObject",
                ____defaultValue: {},

                isValid: { ____accept: "jsBoolean" },

                postConstructionToJSON: {
                    ____accept: [
                        "jsString", // The instance is invalid and this is this._private.constructorError string.
                        "jsObject",  // The instance is valid and this is this._private object.
                    ]
                }
            },
            testActionLog: {
                ____label: "CellProcessor.act Calls Performed by the Test",
                ____types: "jsArray",
                ____defaultValue: [],

                testActionSummary: {
                    ____types: "jsObject",
                    testHarnessActionSummary: {
                        ____types: "jsObject",
                        actionRequest: { ____accept: "jsString", ____inValueSet: [ "PASS", "FAIL" ] },
                        postActionCellProcessorEval: { ____accept: "jsString", ____inValueSet: [ "SKIPPED", "PASS", "FAIL" ] }
                    },
                    testHarnessActionDispatch: {
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
                    },
                    postActionToJSON: { ____accept: "jsObject" }
                } // testActionSummary
            },
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
                    vectorFailed: false, // ?
                    construction: {
                        isValid: cpInstance.isValid(),
                        postConstructionToJSON: serialized,
                    },
                    testActionLog: []
                };

                switch (messageBody.options.failTestIf.CellProcessor.instanceValidity) {
                case "ignore-never-fail":
                    break;
                case "fail-if-instance-invalid":
                    if (!cpInstance.isValid()) {
                        response.result.vectorFailed = true;
                    }
                    break;
                case "fail-if-instance-valid":
                    if (cpInstance.isValid()) {
                        response.result.vectorFailed = true;
                    }
                    break;
                }

                if (cpInstance.isValid()) {
                    switch (messageBody.options.failTestIf.CellProcessor.validInstanceHasOPCWarnings) {
                    case "ignore-never-fail":
                        break;
                    case "fail-if-opc-has-warnings":
                        if (cpInstance.toJSON().opc.toJSON().constructionWarnings.length !== 0) {
                            response.result.vectorFailed = true;
                        }
                        break;
                    case "fail-if-opc-no-warnings":
                        if (cpInstance.toJSON().opc.toJSON().constructionWarnings.length === 0) {
                            response.result.vectorFailed = true;
                        }
                        break;
                    }

                    switch (messageBody.options.failTestIf.CellProcessor.validInstanceHasOPCErrors) {
                    case "ignore-never-fail":
                        break;
                    case "fail-if-opc-has-errors":
                        let lastEvalResponse = cpInstance.toJSON().opc.toJSON().lastEvalResponse;
                        if (lastEvalResponse.error || (lastEvalResponse.result.summary.counts.errors !== 0)) {
                            response.result.vectorFailed = true;
                        }
                        break;
                    case "fail-if-opc-no-errors":
                        lastEvalResponse = cpInstance.toJSON().opc.toJSON().lastEvalResponse;
                        if (!lastEvalResponse.error && (lastEvalResponse.result.summary.counts.errors === 0)) {
                            response.result.vectorFailed = true;
                        }
                        break;
                    }

                }

                if (errors.length) {
                    break;
                }

                messageBody.actRequests.forEach((actRequest_) => {

                    delete cpInstance._private.opc._private.lastEvaluationResponse; // TODO: Figure out why this delete is necessary? Or, is it. I do not remember the details at this point. Seems harmless, so just a TODO.

                    let actResponse = cpInstance.act(actRequest_);

                    // Filter non-idempotent information out of the actResponse object.

                    if (!actResponse.error) {
                        // Might be nice to dump this information to stdout...
                        console.log(actResponse.result.lastEvaluation.summary.evalStopwatch);
                        delete actResponse.result.lastEvaluation.summary.evalStopwatch;
                    }

                    response.result.testActionLog.push({
                        testHarnessActionSummary: {
                            actionRequest: actResponse.error?"FAIL":"PASS",
                            postActionCellProcessorEval: actResponse.error?"SKIPPED":actResponse.result.lastEvaluation.summary.counts.errors?"FAIL":"PASS",

                        },
                        testHarnessActionDispatch: {
                            actRequest: actRequest_,
                            actResponse: actResponse
                        },
                        postActionToJSON: JSON.parse(JSON.stringify(cpInstance.toJSON().opc.toJSON().ocdi.toJSON()))

                    });

                }); // end for test CellProcessor.act calls

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

})();
