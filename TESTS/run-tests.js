#!/usr/bin/env node
"use strict";

const path = require("path");
const holodeck = require("../PLATFORM/holodeck");
const holodeckRunner = holodeck.runnerFilter;

// Test assets.
const holodeckPackageHarnesses = require("./holodeck-package-tests/harnesses");
const holodeckPackageVectorSets = require("./holodeck-package-tests/vector-sets");

const holarchyPackageHarnesses = require("./holarchy-package-tests/harnesses");
const holarchyPackageVectorSets = require("./holarchy-package-tests/vector-sets");

const runnerResponse = holodeckRunner.request({
    id: "TxK2RjDjS2mQLkm_N8b6_Q",
    name: "Holistic Platform Test Vectors",
    description: "A suite of test vectors for exploring and confirming the behaviors of Encapsule Project holistic app platform libraries.",

    logsRootDir: path.resolve(path.join(__dirname, "logs")),

    testHarnessFilters: [
        ...holodeckPackageHarnesses,
        ...holarchyPackageHarnesses
    ],

    testRequestSets: [
        ...holodeckPackageVectorSets,
        ...holarchyPackageVectorSets
    ]

});

if (runnerResponse.error) {
    console.error(`! Test runner returned an error: '${runnerResponse.error}'`);
} else {
    console.log("Complete.");
}

