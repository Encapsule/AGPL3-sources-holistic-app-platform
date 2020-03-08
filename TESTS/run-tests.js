#!/usr/bin/env node
"use strict";

const path = require("path");
const process = require("process");

////
// v--- MOCKERY TRICKS
require("./holistic-platform-mockery");

const holodeckAssets = require("@encapsule/holodeck-assets");

const runnerResponse = holodeckAssets.holistic.request({
    logsDirectory: path.resolve(path.join(__dirname, "logs")),
    testRunnerOptions: {
        // onlyExecuteVectors: ["fzuITg9BQbyV7jNv39Gv6w" ]
    }
});

if (runnerResponse.error) {
    console.error(runnerResponse.error);
    process.exit(1);
}

console.log("Complete.");
process.exit(0);

