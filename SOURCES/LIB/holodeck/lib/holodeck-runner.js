
// good const gitDiffCommand_testVectorEvalJSON = "git diff --unified=0 --stat --numstat -p --dirstat=lines --word-diff=plain";

const gitDiffCommand_testVectorEvalJSON = "git diff --unified=0 --word-diff=plain";

const gitDiffTreeCommand_testVectorEvalJSON = "git diff-tree --no-commit-id -r @~..@";


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

function getRunnerEvalSummaryFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "summary.json");
}

function getRunnerInducedGitDiffsFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "induced-git-diffs.json");
}

function getRunnerResponseFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "runner-response.json");
}

/*
function getBaseSummaryFilename(logsRootDir_) {
    return path.join(getLogDir(logsRootDir_), "holodeck-base-summary.json");
}
*/

function getLogEvalDir(logsRootDir_) {
    const dirPath = path.join(getLogDir(logsRootDir_), "eval");
    mkdirp(dirPath);
    return dirPath;
}

function getHarnessEvalFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}.json`);
}

function getHarnessEvalDiffFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}-git-diff`);
}

function getHarnessEvalDiffChangeLinesFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}-change-lines`);
}

function getHarnessEvalDiffTreeFilename(logsRootDir_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_), `${testID_}-git-diff-tree`);
}

/*
function getLogBaseDir(logsRootDir_) {
    const dirPath = path.join(getLogDir(logsRootDir_), "base");
    mkdirp(dirPath);
    return dirPath;
}

function getHarnessBaselineFilename(logsRootDir_, testID_) {
    return path.join(getLogBaseDir(logsRootDir_), `${testID_}.json`);
}

function getHarnessBaseDiffFilename(logsRootDir__, testID_) {
    return path.join(getLogBaseDir(logsRootDir_), `${testID_}-diff`);
}
*/

function syncExec(request_) {
    // request_ = { command: string, cwd: string,  }
    // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
    // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });
    const response = childProcess.execSync(request_.command, { cwd: request_.cwd }).toString('utf8').trim();
    // console.log(`Subprocess command '${request_.command}' in working directory '${request_.cwd}':`);
    // console.log(response);
    return response;
} // syncExec


const factoryResponse = arccore.filter.create({
    // Every filter must define some basic metadata.
    operationID: idHolodeckRunner,
    operationName: "Holodeck Test Runner",
    operationDescription: "Holodeck is an extensible test runner, execution framework, and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libraries.",
    // Filter specs delcare API runtime data invariants for the `bodyFunction` request/response I/O.
    inputFilterSpec: require("./iospecs/holodeck-runner-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-runner-output-spec"),

    bodyFunction: function(request_) {
        // The request_ in-param is guaranteed to be valid per `inputFilterSpec` (or bodyFunction is simply not dispatched by filter).

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

            // Loop thought the outer set of test sets. And, inner test sets to dispatch each individual test vector through a (hopefully) appropriate holodeck harness filter plug-in.
            console.log("> Dispatching test sets...");
            // Outer set of test sets...
            for (let setNumber = 0 ; setNumber < request_.testRequestSets.length ; setNumber++) {
                const testSet = request_.testRequestSets[setNumber];
                // Inner set of test vectors...
                for (let testNumber = 0 ; testNumber < testSet.length ; testNumber++) {
                    const testRequest = testSet[testNumber];

                    // Here we leverage an arccore.discriminator to route the test vector (a message) to an appropriate handler
                    // for further processing (because the runner doesn't know how to actually test anything - this is entirely
                    // a function of the holodeck handler filter plug-ins registered with the holodeck runner.
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

                    // If this was a typical filter designed for use inside an application or a service we would
                    // probably do some error checking at this point and fail the request if something went wrong.
                    // But, we're writing a test runner and in this case we want the test runner to _never_ fail
                    // (except if it's passed blatantly bad configuration). And, always persist the response of
                    // attempting to dispatch each test vector to a JSON file that we can compare and analyze with
                    // git. Because these evaluation logs are very tightly constrained using filters throughout
                    // holodeck runner and harness factory-produced harness filter plug-ins we can gain great
                    // insight into the correct or incorrect operation of our implementation code via git diff
                    // without having to specifiy and maintain very fine-grained analysis scripts, and large
                    // amounts of hand-maintained "expected results" data.
                    const testEvalDescriptor = {};
                    testEvalDescriptor[idHolodeckRunnerEvalReport] = {};
                    const harnessFilterId = harnessFilter?harnessFilter.filterDescriptor.operationID:"000000000000000000";
                    testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId] = {};
                    testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId][testRequest.id] = {
                        harnessRequest: testRequest,
                        harnessResponse: testResponse
                    };

                    const harnessEvalFilename = getHarnessEvalFilename(request_.logsRootDir, testRequest.id);
                    const harnessEvalDiffFilename = getHarnessEvalDiffFilename(request_.logsRootDir, testRequest.id);
                    const harnessEvalDiffChangeLinesFilename = getHarnessEvalDiffChangeLinesFilename(request_.logsRootDir, testRequest.id);

                    const harnessEvalJSON = `${JSON.stringify(testEvalDescriptor, undefined, 2)}\n`;
                    fs.writeFileSync(harnessEvalFilename, harnessEvalJSON); // Always write the harness evaluation JSON log

                    // See discussion on git diff: https://github.com/git/git/blob/master/Documentation/diff-format.txt
                    const gitDiffResponse = syncExec({
                        command: `${gitDiffCommand_testVectorEvalJSON} ${harnessEvalFilename}`,
                        cwd: getLogEvalDir(request_.logsRootDir)
                    });

                    if (gitDiffResponse.length) {
                        fs.writeFileSync(harnessEvalDiffFilename, `${gitDiffResponse}\n`);

                        const gitDiffResponseLines = gitDiffResponse.split("\n");

                        const gitDiffResponseLinesChanges = [];
                        gitDiffResponseLines.forEach(function(line_) {
                            if (line_.startsWith("@@") && line_.endsWith("@@")) {
                                gitDiffResponseLinesChanges.push(line_);
                            }
                        });

                        if (gitDiffResponseLinesChanges.length) {
                            fs.writeFileSync(harnessEvalDiffChangeLinesFilename, `${gitDiffResponseLinesChanges.join("\n")}\n`);
                        } else {
                            syncExec({
                                command: `rm -f ${harnessEvalDiffChangeLinesFilename}`,
                                cwd: getLogEvalDir(request_.logsRootDir)
                            });
                        }

                    } else {
                        syncExec({
                            command: `rm -f ${harnessEvalDiffFilename}`,
                            cwd: getLogEvalDir(request_.logsRootDir)
                        });
                        syncExec({
                            command: `rm -f ${harnessEvalDiffChangeLinesFilename}`
                        });
                    }

                    /*
                    const gitDiffTreeResponse = syncExec({
                        command: `${gitDiffTreeCommand_testVectorEvalJSON} ${harnessEvalFilename}`,
                        cwd: getLogEvalDir(request_.logsRootDir)
                    });
                    const harnessEvalDiffTreeFilename = getHarnessEvalDiffTreeFilename(request_.logsRootDir, testRequest.id);
                    fs.writeFileSync(harnessEvalDiffTreeFilename, `${gitDiffTreeResponse}\n`);
                    */

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
        // This is a standard-form filter response object { error: null | string, result: variant }.
        // In this case we have specified an `outputFilterSpec` that provides our caller with invariant
        // guarantees over the output of `response` returned by this `bodyFunction`. This means that
        // if `bodyFunction` produces a response result (i.e. response.error !== null) then filter
        // will possibly invalidate the response (i.e. will set response.error = "error string...")
        // iff response.result violates the constraints declared by `outputFilterSpec`.
        // This is important because the runner output is often serialized to JSON and written to
        // a commited file for comparison and analysis with git.
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

        const runnerResponse = holisticTestRunner.request(runnerRequest_);

        console.log("> Finalizing results and writing summary log...");

        const analysis = {};

        if (!runnerResponse.error) {
            const resultPayload = runnerResponse.result[idHolodeckRunner];
            console.log("Runner summary:");

            analysis.totalTestVectors = resultPayload.summary.requests;
            console.log(`> total test vectors ......... ${analysis.totalTestVectors}`);

            analysis.totalDispatchedVectors = resultPayload.summary.runnerStats.dispatched.length;
            console.log(`> total dispatched vectors ... ${analysis.totalDispatchedVectors}`);

            analysis.totalHarnessResults = resultPayload.summary.runnerStats.dispatched.length - resultPayload.summary.runnerStats.errors.length;
            console.log(`> total harness results .,.... ${analysis.totalHarnessResults}`);

            analysis.totalHarnessErrors = resultPayload.summary.runnerStats.errors.length;
            console.log(`> total harness errors ...,... ${analysis.totalHarnessErrors}`);

            analysis.totalRejectedVectors = resultPayload.summary.runnerStats.rejected.length;
            console.log(`> total rejected vectors ..... ${analysis.totalRejectedVectors}`);
        } else {
            console.error(`Runner failed with error: ${runnerResponse.error}`);
            console.log("Holodeck test vector evaluation log files may have been created/modified.");
            console.log("Holodeck runner evaluation summary files have not been generated due to error.");
            return runnerResponse;
        }

        console.log("..... runner returned a response result. Analyzing...");

        const gitDiffTreeResponse = syncExec({
            command: `git diff --unified=0 ${getLogEvalDir(runnerRequest_.logsRootDir)}`,
            cwd: getLogEvalDir(runnerRequest_.logsRootDir)
        });

        const gitDiffTreeOutput = (gitDiffTreeResponse && gitDiffTreeResponse.length)?gitDiffTreeResponse.split("\n"):null;

        fs.writeFileSync(getRunnerEvalSummaryFilename(runnerRequest_.logsRootDir), `${JSON.stringify(analysis, undefined, 2)}\n`);
        fs.writeFileSync(getRunnerInducedGitDiffsFilename(runnerRequest_.logsRootDir), `${JSON.stringify(gitDiffTreeOutput, undefined, 2)}\n`);
        fs.writeFileSync(getRunnerResponseFilename(runnerRequest_.logsRootDir), `${JSON.stringify(runnerResponse, undefined, 2)}\n`);

        return runnerResponse;
    }
};

module.exports = runnerFascade;

