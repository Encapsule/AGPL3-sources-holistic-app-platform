#!/usr/bin/env node
"use strict";

const path = require("path");

////
// v--- MOCKERY TRICKS
const local_holodeck = require("../PLATFORM/holodeck");
const local_holarchy = require("../PLATFORM/holarchy");

const mockery = require("mockery");
mockery.enable();
mockery.registerMock("@encapsule/holodeck", local_holodeck);
mockery.registerMock("@encapsule/holarchy", local_holarchy);

mockery.registerAllowables([

    "@encapsule/arccore",
    "./holodeck-package-tests/harnesses",
    "./holodeck-package-tests/vector-sets",
    "./harnesses/harness-test-1",
    "./harnesses/harness-test-2",
    "./harnesses/harness-test-3",
    "./harnesses/harness-test-4",
    "./harnesses/harness-test-5",

    "./holarchy-package-tests/harnesses",
    "./holarchy-package-tests/vector-sets",
    "./harnesses/harness-ObservableProcessController",
    "./vector-sets-opc/vector-set-opc-constructor",
    "./vector-sets-opc/vector-set-opc-constructor-bindings",
    "./fixture-opm-examples",

    "../PLATFORM/holodeck-assets",
    "./holodeck",
    "./harnesses",
    "./harness-test-1",
    "./harness-test-2",
    "./harness-test-3",
    "./harness-test-4",
    "./harness-test-5"

]);

const local_holodeckAssets = require("../PLATFORM/holodeck-assets");
mockery.registerMock("@encapsule/holodeck-assets", local_holodeckAssets);

// ^--- MOCKERY TRICKS
////

const holodeck = require("@encapsule/holodeck");
const holodeckRunner = holodeck.runnerFilter;

const holodeckAssets = require("@encapsule/holodeck-assets");

// HOLODECK TEST ASSETS
const holodeckPackageHarnesses = holodeckAssets.holodeck.harnesses;
const holodeckPackageVectorSets = require("./holodeck-package-tests/vector-sets");

const holarchyPackageHarnesses = holodeckAssets.holarchy.harnesses;
const holarchyPackageVectorSets = require("./holarchy-package-tests/vector-sets");

// HOLODECK TEST RUNNER DEFINITION
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

