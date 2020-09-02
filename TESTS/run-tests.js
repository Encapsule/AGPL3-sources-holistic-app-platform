#!/usr/bin/env node
"use strict";

const path = require("path");
const process = require("process");

require("./mock-platform");

const holodeckAssets = require("@encapsule/holodeck-assets");

const runnerResponse = holodeckAssets.holistic.request({
    logsDirectory: path.resolve(path.join(__dirname, "logs")),
    testRunnerOptions: {
        // onlyExecuteVectors: ["fzuITg9BQbyV7jNv39Gv6w" ]
    }
});

if (runnerResponse.error) {
    console.error(runnerResponse.error);
//    process.exit(1);
}

console.log("@encapsule/holistic platform development regression tests have been executed through @encapsule/holodeck v1 program.");
console.log("> There may be outstanding activity precluding OS process exit that we're still waiting on that was started by the tests.");
console.log("... Please wait for the test cell processes to complete.");

// process.exit(0); // Nope, we do not want to do this w/async tests running in CellProcessor ;-)


