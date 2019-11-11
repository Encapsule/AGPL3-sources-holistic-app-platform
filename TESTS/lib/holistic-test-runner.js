
const arccore = require("@encapsule/arccore");

const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");


const holisticRunnerResultSpec = {
    ____types: "jsObject",
    "NVELEE9lQ96cdVpidNlsPQ": {
        ____types: "jsObject",
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
                    result: { ____accept: [ "jsUndefined", "jsObject" ] }
                }
            }
        }
    }
};
// A bit non-standard as we double-filter the response.result in this case.
// First time we pass the response.result through a simple egress filter to
// ensure it's valid before we write the runner's summary log JSON. That way
// we can reflect any errors validating the report in the persisted log that
// we'll be comparing with git. If we don't do this then the filter returns
// the egress validation error to caller (e.g. the shell) and the summary
// log reflects only what bodyFunction _thinks_ is valid (which may not be).

let factoryResponse = arccore.filter.create({
    operationID: "hYTq8QA6TfaSTQwpQwBvdw",
    operationName: "Holistic Runner Result Filter",
    operationDescription: "Validates/normalizes the proposed response.result of the holistic test runner's bodyFunction to ensure that any errors are written to the runner's summary log file.",
    outputFilterSpec: holisticRunnerResultSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

const runnerResponseResultFilter = factoryResponse.result;

factoryResponse = arccore.filter.create({

    operationID: "XkT3fzhYT0izLU_P2WF54Q",
    operationName: "Holistic Test Runner",
    operationDescription: "Holistic test runner is an test execution framework and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libs.",
    inputFilterSpec: {
        ____types: "jsObject",
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
    outputFilterSpec: { ____opaque: true }, // We do this manually _inside_ bodyFunction in this case because we need to normalize prior to writing summary log file.

    bodyFunction: function(request_) {
        let response = {
            error: null,
            result: {
                "NVELEE9lQ96cdVpidNlsPQ": {
                    harnessEvalDescriptors: []
                }
            }
        };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log(`> Initializing test runner log directory '${request_.logsRootDir}'...`);
            mkdirp(request_.logsRootDir);
            console.log("> Initializing test harness dispatcher...");
            const factoryResponse = arccore.discriminator.create({
                options: { action: "routeRequest" },
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
                    console.log(`..... Dispatching test #${dispatchCount++} - [${testRequest.id}::${testRequest.name}]`);
                    const testResponse = harnessDispatcher.request(testRequest);
                    const testEvalDescriptor = { testRequest, testResponse };
                    const testEvalDescriptorJSON = JSON.stringify(testEvalDescriptor, undefined, 4);
                    const logHarnessFilename = path.join(request_.logsRootDir, `holistic-runner-test-eval-${testRequest.id}.json`);
                    fs.writeFileSync(logHarnessFilename, testEvalDescriptorJSON);
                    response.result["NVELEE9lQ96cdVpidNlsPQ"].harnessEvalDescriptors.push(testEvalDescriptor);
                } // for testNumber
            } // for setNumber
            break;
        } // while (!inBreakScope)
        if (errors.length) {
            response.error = errors.join(" ");
        } else {
            console.log("> Finalizing results and writing summary log...");
            // Validate response.result and write the summary log file.
            const resultResponse = runnerResponseResultFilter.request(response.result);
            if (resultResponse.error) {
                response.error = resultResponse.error;
            }
            const responseJSON = JSON.stringify(response, undefined, 4);
            const logSummaryFilename = path.resolve(path.join(request_.logsRootDir, "holistic-runner-summary.json"));
            fs.writeFileSync(logSummaryFilename, responseJSON);
            return response;
        }
    },
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result; // the test runner filter
