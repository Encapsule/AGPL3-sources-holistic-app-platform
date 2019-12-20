#!/usr/bin/env node
"use strict";

const path = require("path");
const process = require("process");

////
// v--- MOCKERY TRICKS
const local_holodeck = require("../PLATFORM/holodeck");
const local_holarchy = require("../PLATFORM/holarchy");

const mockery = require("mockery");
mockery.enable();
mockery.registerMock("@encapsule/holodeck", local_holodeck);
mockery.registerMock("@encapsule/holarchy", local_holarchy);

/*
// DISABLE - THESE WARNINGS ARE HARMLESS I THINK.

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
*/

const local_holarchySml = require("../PLATFORM/holarchy-sml");
mockery.registerMock("@encapsule/holarchy-sml", local_holarchySml);

const local_holodeckAssets = require("../PLATFORM/holodeck-assets");
mockery.registerMock("@encapsule/holodeck-assets", local_holodeckAssets);

// ^--- MOCKERY TRICKS
////


const holodeckAssets = require("@encapsule/holodeck-assets");

const runnerResponse = holodeckAssets.holistic.request({ logsDirectory: path.resolve(path.join(__dirname, "logs")) });

if (runnerResponse.error) {
    console.error(runnerResponse.error);
    process.exit(1);
}

console.log("Complete.");
process.exit(0);

