
const arccore = require("@encapsule/arccore");

const childProcess = require("child_process");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

const idHolodeckRunner = "XkT3fzhYT0izLU_P2WF54Q";
const idHolodeckRunnerEvalReport = "dosRgxmiR66ongCbJB78ow";

function getLogDir(logsRootDir_) {
    mkdirp(logsRootDir_);
    return logsRootDir_;
}

function getEvalSummaryFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "holodeck-eval-summary.json");
}

function getBaseSummaryFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "holodeck-base-summary.json");
}

function getLogEvalDir(logsRootDir_) {
    const dirPath = path.join(getLogDir(logsRootDir_), "eval");
    mkdirp(dirPath);
    return dirPath;
}

function getHarnessEvalFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}.json`);
}

function getHarnessEvalDiffFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}-diff.json`);
}

function getLogBaseDir(logsRootDir_) {
    const dirPath = path.join(getLogDir(logsRootDir_), "base");
    mkdirp(dirPath);
    return dirPath;
}

function getHarnessBaselineFilename(logsRootDir_, testID_) {
    return path.join(getLogBaseDir(logsRootDir_), `${testID_}.json`);
}

function getHarnessBaseDiffFilename(logsRootDir__, testID_) {
    return path.join(getLogBaseDir(logsRootDir_), `${testID_}-diff.jaon`);
}

function syncExec(request_) {
    // request_ = { command: string, cwd: string,  }
    // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
    // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });
    console.log(`Subprocess command '${request_.command}' in working directory '${request_.cwd}':`);
    const response = childProcess.execSync(request_.command, { cwd: request_.cwd }).toString('utf8').trim();
    console.log(response);
    return response;
} // syncExec


const factoryResponse = arccore.filter.create({

    operationID: idHolodeckRunner,
    operationName: "Holodeck Test Runner",
    operationDescription: "Holodeck is an extensible test runner, execution framework, and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libraries.",

    inputFilterSpec: require("./iospecs/holodeck-runner-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-runner-output-spec"),

    bodyFunction: function(request_) {

        const result = {};
        result[idHolodeckRunner] = {
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
        };
        const response = { error: null, result: result };
        const resultPayload = response.result[idHolodeckRunner];
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
                    let harnessFilter = null;
                    let testResponse = harnessDispatcher.request(testRequest); // try to resolve the harness filter from the test request message.
                    if (testResponse.error) {
                        testResponse.error = `Runner cannot locate a harness filter to process this request type: ${testResponse.error}`;
                        resultPayload.summary.runnerStats.rejected.push(testRequest.id);
                    } else {
                        harnessFilter = testResponse.result;
                        testResponse = harnessFilter.request(testRequest); // dispatch the actual test vector
                        resultPayload.summary.runnerStats.dispatched.push(testRequest.id);
                        if (testResponse.error) {
                            testResponse.error = `The harness filter registered to handle this message type rejected your request with an error: ${testResponse.error}`;
                            resultPayload.summary.runnerStats.errors.push(testRequest.id);
                        }
                    }
                    const testEvalDescriptor = {};
                    testEvalDescriptor[idHolodeckRunnerEvalReport] = {};
                    const harnessFilterId = harnessFilter?harnessFilter.filterDescriptor.operationID:"000000000000000000";
                    testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId] = {};
                    testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId][testRequest.id] = {
                        harnessRequest: testRequest,
                        harnessResponse: testResponse
                    };

                    const harnessEvalFilename = getHarnessEvalFilename(request_.logsRootDir, testRequest.id);
                    const harnessEvalJSON = `${JSON.stringify(testEvalDescriptor, undefined, 2)}\n`;
                    fs.writeFileSync(harnessEvalFilename, harnessEvalJSON);

                    const gitDiffResponse = syncExec({
                        command: `git diff --raw ${harnessEvalFilename}`,
                        cwd: getLogEvalDir(request_.logsRootDir)
                    });

                    const harnessEvalDiffFilename = getHarnessEvalDiffFilename(request_.logsRootDir, testRequest.id);
                    if (gitDiffResponse.length) {
                        fs.writeFileSync(harnessEvalDiffFilename, `${gitDiffResponse}\n`);
                    } else {
                        syncExec({
                            command: `rm -f ${harnessEvalDiffFilename}`,
                            cwd: getLogEvalDir(request_.logsRootDir)
                        });
                    }

                    resultPayload.harnessEvalDescriptors.push(testEvalDescriptor);
                    resultPayload.summary.requests++;
                } // for testNumber
            } // for setNumber

            resultPayload.summary.runnerStats.dispatched.sort();
            resultPayload.summary.runnerStats.rejected.sort();
            resultPayload.summary.runnerStats.errors.sort();
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

// ================================================================
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
            const resultPayload = runnerResponse.result[idHolodeckRunner];
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

