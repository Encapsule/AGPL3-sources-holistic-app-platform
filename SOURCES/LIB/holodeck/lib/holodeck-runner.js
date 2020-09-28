// holodeck-runner.js
//
// Holodeck runner is an arccore.filter whose request method executes a caller-defined sequence of
// holodeck harness filter calls using a variant of the recursive Message-Discriminated-Routing
// pattern (see: https://github.com/arcspace/dmr-hello-world).


// good const gitDiffCommand_testVectorEvalJSON = "git diff --unified=0 --stat --numstat -p --dirstat=lines --word-diff=plain";
const gitDiffCommand_testVectorEvalJSON = "git diff --word-diff=plain"; // --unified=<dynamic> better

const fs = require("fs");
const arccore = require("@encapsule/arccore");
const helpers = require("./helpers");

const idHolodeckRunner = "XkT3fzhYT0izLU_P2WF54Q";
const idHolodeckRunnerEvalReport = "dosRgxmiR66ongCbJB78ow";

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
                    errors: [],
                    failures: [],
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
                    const testRequest = {
                        ...testSet[testNumber],
                        harnessDispatcher: harnessDispatcher,
                        harnessRunner: runnerFascade, // note that we pass the fascade that calls this filter, not the filter itself down the MDR dispatch tree.
                        logsRootDir: request_.logsRootDir,
                        logsCurrentDir: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
                    };

                    // Process runner options vector exclusions.
                    if (request_.testRunnerOptions.onlyExecuteVectors /*null by default or array if true*/) {
                        const indexOfCurrentVector = request_.testRunnerOptions.onlyExecuteVectors.indexOf(testRequest.id);
                        if (indexOfCurrentVector < 0) {
                            console.log("Skipping test vector '" + testRequest.id + "'.");
                            continue;
                        }
                    }

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
                        } else {
                            // NOTE: HORRIBLE HACK to allow specific harness filters to set a vectorFailed Boolean flag in #.vectorFailed of vectorResponse.result object.
                            // It's done this way because I am too lazy and too busy to refactor the test harness factory infrastructure for holodeck v1 (and destabilize
                            // all existing v1 holodeck harness filter definitions in the process). So, hack it (for now). holodeck v2 may never get done w/the code I
                            // started; if we get CellProcessor stable w/holodeck v1 (which is not w/out issues which is why v2 in the first place). Then it makes no sense
                            // to write v2 holodeck by hand. It's a collection of CellModel like everything else. And, why implement RMDR protocols when you have ControllerAction?
                            if (Object.prototype.toString.call(testResponse.result) === "[object Object]") {
                                if (testResponse.result.harnessDispatch) {
                                    const key1 = Object.keys(testResponse.result.harnessDispatch)[0];
                                    const key2 = Object.keys(testResponse.result.harnessDispatch[key1])[0];
                                    const vectorResult = testResponse.result.harnessDispatch[key1][key2];
                                    if (Object.prototype.toString.call(vectorResult) === "[object Object]") {
                                        if (vectorResult.vectorFailed) {
                                            resultPayload.summary.runnerStats.failures.push(key2);
                                        }
                                    }
                                }
                            }
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

                    // Delete non-idempotent and not really interesting information from the request sent to the holodeck harness proxy.
                    delete testRequest.harnessDispatcher;
                    delete testRequest.harnessRunner;
                    delete testRequest.logsRootDir;
                    delete testRequest.logsCurrentDir;

                    testEvalDescriptor[idHolodeckRunnerEvalReport] = {};
                    const harnessFilterId = harnessFilter?harnessFilter.filterDescriptor.operationID:"000000000000000000";
                    testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId] = {};
                    const boxedResponse = testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId][testRequest.id] = {
                        harnessRequest: testRequest,
                        harnessResponse: testResponse
                    };

                    const harnessEvalFilename = helpers.getHarnessEvalFilename(request_.logsRootDir, request_.id, testRequest.id);
                    const harnessEvalDiffFilename = helpers.getHarnessEvalDiffFilename(request_.logsRootDir, request_.id, testRequest.id);
                    const harnessEvalDiffChangeLinesFilename = helpers.getHarnessEvalDiffChangeLinesFilename(request_.logsRootDir, request_.id, testRequest.id);

                    const harnessEvalJSON = `${JSON.stringify(testEvalDescriptor, undefined, 2)}\n`;

                    // WRITE THE MAIN HARNESS EVALUATION JSON LOG FILE UNCONDITIONALLY.
                    fs.writeFileSync(harnessEvalFilename, harnessEvalJSON); // Always write the harness evaluation JSON log

                    const gitDiffUnified = 8; // experiment - if idempotent, then use course (not granular) default git diff hunk size.

                    if (!boxedResponse.harnessResponse.error) {
                        if (!boxedResponse.harnessResponse.result.harnessOptions.idempotent) {
                            gitDiffUnified = boxedResponse.harnessResponse.result.harnessOptions.gitDiffHunkSize;
                        }
                    }

                    // See discussion on git diff: https://github.com/git/git/blob/master/Documentation/diff-format.txt

                    const diffCommand = `git diff -p --unified=${gitDiffUnified} --numstat --dirstat=lines --word-diff=plain ${harnessEvalFilename} > ${harnessEvalDiffFilename}`;
                    // console.log("$ " + diffCommand);

                    const gitDiffResponse = helpers.syncExecKeepConsole({
                        command: diffCommand,
                        cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
                    });

                    gitDiffResponse = fs.readFileSync(harnessEvalDiffFilename).toString("utf8");

                    if (gitDiffResponse.length) {

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
                            helpers.syncExec({
                                command: `rm -f ${harnessEvalDiffChangeLinesFilename}`,
                                cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
                            });
                        }

                    } else {
                        helpers.syncExec({
                            command: `rm -f ${harnessEvalDiffFilename}`,
                            cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
                        });
                        helpers.syncExec({
                            command: `rm -f ${harnessEvalDiffChangeLinesFilename}`
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
// We make it look like a filter so that people can more easily peak at the export
// and understand immediately what it is and how to use it. We do all this because
// we actually want to leverage all three filter stages of the actual runner filter
// for the purposes of testing. Unlike normal filter usable where an error is something
// that you either act on conditionally (or report and return back to your caller),
// we want capture failures that bounce off filter input stage (i.e. never make
// into the actual runner bodyFunction), errors inside the runnerBodyFunction,
// and any mishaps coming back out through the output stage of the filter.
// And we want all of this to get logged to disk. So, we can't do it inside
// the actual runner's bodyFunction. So, that's why this is like this.

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
            console.log("..... runner returned a response.result. Analyzing...");

            const resultPayload = runnerResponse.result[idHolodeckRunner];
            console.log(`Runner '${runnerRequest_.id}' summary:`);

            analysis.totalTestVectors = resultPayload.summary.requests;
            console.log(`> total test vectors ......... ${analysis.totalTestVectors}`);

            analysis.totalDispatchedVectors = resultPayload.summary.runnerStats.dispatched.length;
            console.log(`> total dispatched vectors ... ${analysis.totalDispatchedVectors}`);

            analysis.totalHarnessResults = resultPayload.summary.runnerStats.dispatched.length - resultPayload.summary.runnerStats.errors.length;
            console.log(`> total harness results ...... ${analysis.totalHarnessResults}`);

            analysis.totalHarnessErrors = resultPayload.summary.runnerStats.errors.length;
            console.log(`> total harness errors ....... ${analysis.totalHarnessErrors}`);

            analysis.totalRejectedVectors = resultPayload.summary.runnerStats.rejected.length;
            console.log(`> total rejected vectors ..... ${analysis.totalRejectedVectors}`);

            analysis.totalFailedVectors = resultPayload.summary.runnerStats.failures.length;
            console.log(`> total FAILED vectors ....... ${analysis.totalFailedVectors}`);

        } else {
            console.error(`Runner failed with error: ${runnerResponse.error}`);
            console.log("Holodeck test vector evaluation log files may have been created/modified.");
            console.log("Holodeck runner evaluation summary files have not been generated due to error.");
            return runnerResponse;
        }

        const runnerEvalLogsDir = helpers.getLogEvalDir(runnerRequest_.logsRootDir, runnerRequest_.id);
        const runnerInducedGitDiffsFilename = helpers.getRunnerInducedGitDiffsFilename(runnerRequest_.logsRootDir, runnerRequest_.id);

        const gitDiffTreeResponse = helpers.syncExec({
            command: `git diff --unified=0 ${runnerEvalLogsDir} > ${runnerInducedGitDiffsFilename}`,
            cwd: runnerEvalLogsDir
        });


        fs.writeFileSync(helpers.getRunnerEvalSummaryFilename(runnerRequest_.logsRootDir, runnerRequest_.id), `${JSON.stringify(analysis, undefined, 2)}\n`);
        fs.writeFileSync(helpers.getRunnerResponseFilename(runnerRequest_.logsRootDir, runnerRequest_.id), `${JSON.stringify(runnerResponse, undefined, 2)}\n`);

        return runnerResponse;
    }
};

module.exports = runnerFascade;

