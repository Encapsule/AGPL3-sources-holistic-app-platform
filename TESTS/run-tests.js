#!/usr/bin/env node
"use strict";

const path = require("path");
const process = require("process");


require("./mock-platform");

const holodeckAssets = require("@encapsule/holodeck-assets");

(function runTests() {

    let processExitCode = 0; // success

    const runnerResponse = holodeckAssets.holistic.request({
        logsDirectory: path.resolve(path.join(__dirname, "logs")),
        testRunnerOptions: {
            // onlyExecuteVectors: ["N8wBqzGVT6i6Dvwzff4Zrw" ]
        }
    });

    if (runnerResponse.error) {
        console.error(runnerResponse.error);
        processExitCode = 1; // general failure
    } else {
        const summary = runnerResponse.result[Object.keys(runnerResponse.result)[0]].summary;
        processExitCode = !summary.runnerStats.failures.length?0:(summary.runnerStats.failures.length + 700);
    }

    /*
      console.log("@encapsule/holistic platform development regression tests have been executed through @encapsule/holodeck v1 program.");
      console.log("> There may be outstanding activity precluding OS process exit that we're still waiting on that was started by the tests.");
      console.log("... Please wait for the test cell processes to complete.");
    */

    console.log("holodeck runner exit process w/code " + processExitCode)
    process.exit(processExitCode);

})();



