#!/usr/bin/env node
"use strict";

const path = require("path");
const holisticTestRunner = require("./lib/holistic-test-runner");

const runnerResponse = holisticTestRunner.request({
    id: "TxK2RjDjS2mQLkm_N8b6_Q",
    name: "Holistic Platform Test Vectors",
    description: "A suite of test vectors for exploring and confirming the behaviors of Encapsule Project holistic app platform libraries.",
    logsRootDir: path.resolve(path.join(__dirname, "holodeck-logs")),
    testHarnessFilters: [
            ...require("./package-tests-holodeck/harnesses"),
            ...require("./package-tests-holarchy/harnesses")
    ],
    testRequestSets: [
            ...require("./package-tests-holodeck/vector-sets"),
            ...require("./package-tests-holarchy/vector-sets")
    ]
});

if (runnerResponse.error) {
    console.error(`! Test runner returned an error: '${runnerResponse.error}'`);
} else {
    console.log("Complete.");
}

