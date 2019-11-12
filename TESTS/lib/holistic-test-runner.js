
const arccore = require("@encapsule/arccore");

const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

function getEvalSummaryFilename(dirPath_) {
    mkdirp(dirPath_);
    return path.join(dirPath_, "holodeck-eval-summary.json");
}

function getBaseSummaryFilename(dirPath_) {
    mkdirp(dirPath_);
    return path.join(dirPath_, "holodeck-base-summary.json");
}

function getHarnessEvalFilename(dirPath_, testID_) {
    const dirPath = path.join(dirPath_, "eval");
    mkdirp(dirPath);
    return path.join(dirPath, `${testID_}-eval.json`);
}

function getHarnessBaselineFilename(dirPath_, testID) {
    const dirPath = path.join(dirPath_, "base");
    mkdirp(dirPath);
    return path.join(dirPath, `${testID_}-base.json`);
}

const factoryResponse = arccore.filter.create({

    operationID: "XkT3fzhYT0izLU_P2WF54Q",
    operationName: "Holistic Test Runner",
    operationDescription: "Holistic test runner is an test execution framework and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libs.",

    inputFilterSpec: {
        ____types: "jsObject",
        id: {
            ____accept: "jsString",
        },
        name: {
            ____accept: "jsString"
        },
        description: {
            ____accept: "jsString"
        },
        logsRootDir: {
            // Fully-qualified local directory where the test runner will create JSON-format log files.
            ____accept: "jsString"
        },
        testHarnessFilters: {
            ____types: "jsArray",
            ____defaultValue: [],
            testHarnessFilter: { ____accept: "jsObject" } // test harness filter instance reference
        },
        testRequestSets: {
            ____types: "jsArray",
            ____defaultValue: [],
            testRequestSet: {
                ____types: "jsArray",
                testRequest: {
                    ____types: [ "jsUndefined" , "jsObject" ],
                    id: { ____accept: "jsString" },
                    name: { ____accept: "jsString" },
                    description: { ____accept: "jsString" },
                    // expectedOutcome: { ____accept: "jsString", ____inValueSet: [ "pass", "fail" ] },
                    harnessRequest: { ____accept: [ "jsUndefined", "jsObject" ] }
                }
            }
        }
    },

    outputFilterSpec: {
        ____types: "jsObject",
        "NVELEE9lQ96cdVpidNlsPQ": {
            ____types: "jsObject",
            summary: {
                ____types: "jsObject",
                requests: { ____types : "jsNumber" },
                runnerStats: {
                    ____types: "jsObject",
                    dispatched: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } },
                    rejected: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } },
                    errors: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } }
                },
                runnerEval: {
                    ____types: "jsObject",
                    neutral: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } },
                    pass: {
                        ____types: "jsObject",
                        expected: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } },
                        actual: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } }
                    },
                    fail: {
                        ____types: "jsObject",
                        expected: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } },
                        actual: { ____types: "jsArray", evalIndex: { ____types: "jsNumber" } }
                    }
                }
            },
            harnessEvalDescriptors: {
                ____types: "jsArray",
                harnessEvalDescriptor: {
                    ____types: "jsObject",
                    testRequest: {
                        ____accept: "jsObject" // TODO: I think we rely on the harness dispatcher to discriminate this?
                    },
                    testResponse: {
                        ____types: "jsObject",
                        error: { ____accept: [ "jsNull", "jsString" ] },
                        result: { ____opaque: true } // we cannot reasonably predict this value at this level of abstraction
                    }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = {
            error: null,
            result: {
                "NVELEE9lQ96cdVpidNlsPQ": {
                    summary: {
                        requests: 0,
                        runnerStats: {
                            dispatched: [],
                            rejected: [],
                            errors: []
                        },
                        runnerEval: {
                            neutral: [],
                            pass: {
                                expected: [],
                                actual: []
                            },
                            fail: {
                                expected: [],
                                actual: []
                            }
                        }
                    },
                    harnessEvalDescriptors: []
                }
            }
        };
        const resultPayload = response.result["NVELEE9lQ96cdVpidNlsPQ"];

        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("> Initializing test harness dispatcher...");
            const factoryResponse = arccore.discriminator.create({
                options: { action: "getFilter" },
                filters: request_.testHarnessFilters
            });
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            const harnessDispatcher = factoryResponse.result;
            console.log("..... Test harness dispatcher initialized.");
            let dispatchCount = 1;
            console.log("> Dispatching test sets...");
            for (let setNumber = 0 ; setNumber < request_.testRequestSets.length ; setNumber++) {
                const testSet = request_.testRequestSets[setNumber];
                for (let testNumber = 0 ; testNumber < testSet.length ; testNumber++) {
                    const testRequest = testSet[testNumber];
                    console.log(`..... Running test #${resultPayload.summary.requests} : [${testRequest.id}::${testRequest.name}]`);

                    let testResponse = harnessDispatcher.request(testRequest); // try to resolve the harness filter from the test request message.
                    if (testResponse.error) {
                        testResponse.error = `Runner cannot locate a harness filter to process this request type: ${testResponse.error}`;
                        resultPayload.summary.runnerStats.rejected.push(resultPayload.summary.requests);
                    } else {
                        const harnessFilter = testResponse.result;
                        testResponse = harnessFilter.request(testRequest); // dispatch the actual test vector
                        resultPayload.summary.runnerStats.dispatched.push(resultPayload.summary.requests);
                        if (testResponse.error) {
                            testResponse.error = `The harness filter registered to handle this message type rejected your request with an error: ${testResponse.error}`;
                            resultPayload.summary.runnerStats.errors.push(resultPayload.summary.requests);
                        }
                    }
                    const testEvalDescriptor = { testRequest, testResponse };
                    const testEvalDescriptorJSON = `${JSON.stringify(testEvalDescriptor, undefined, 2)}\n`;
                    fs.writeFileSync(getHarnessEvalFilename(request_.logsRootDir, testRequest.id), testEvalDescriptorJSON);
                    response.result["NVELEE9lQ96cdVpidNlsPQ"].harnessEvalDescriptors.push(testEvalDescriptor);
                    resultPayload.summary.requests++;
                } // for testNumber
            } // for setNumber
            break;

        } // while (!inBreakScope)
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

const holisticTestRunner = factoryResponse.result;

// Build the test runner wrapper function (looks like a filter but it's not);

const runnerFascade = { // fake filter
    ...holisticTestRunner,
    request: function(runnerRequest_) {
        // In this outer wrapper we're concerned only with the runnerRequest_.logsRootDir string
        // that we need to write the test runner filter response to a JSON-format logfile.
        if (!runnerRequest_ ||
            !runnerRequest_.logsRootDir ||
            (Object.prototype.toString.call(runnerRequest_.logsRootDir) !== '[object String]'))
        {
            throw new Error("Bad request. Runner wrapper needs you to specify a string value 'logsRootDir' (fully-qualified filesystem directory path).");
        }

        console.log(`> Initializing test runner log directory '${runnerRequest_.logsRootDir}'...`);
        mkdirp(runnerRequest_.logsRootDir);

        const runnerResponse = holisticTestRunner.request(runnerRequest_);

        console.log("> Finalizing results and writing summary log...");
        const responseJSON = `${JSON.stringify(runnerResponse, undefined, 2)}\n`;
        fs.writeFileSync(getEvalSummaryFilename(runnerRequest_.logsRootDir), responseJSON);

        if (!runnerResponse.error) {
            const resultPayload = runnerResponse.result["NVELEE9lQ96cdVpidNlsPQ"];

            console.log("Runner summary:");
            console.log(`> total test vectors ......... ${resultPayload.summary.requests}`);
            console.log(`> total dispatched vectors ... ${resultPayload.summary.runnerStats.dispatched.length}`);
            console.log(`> total harness results .,.... ${resultPayload.summary.runnerStats.dispatched.length - resultPayload.summary.runnerStats.errors.length}`);
            console.log(`> total harness errors ...,... ${resultPayload.summary.runnerStats.errors.length}`);
            console.log(`> total rejected vectors ..... ${resultPayload.summary.runnerStats.rejected.length}`);
        } else {
            console.log(`Runner failed with error: ${runnerResponse.error}`);
        }

        return runnerResponse;
    }
};

module.exports = runnerFascade;

