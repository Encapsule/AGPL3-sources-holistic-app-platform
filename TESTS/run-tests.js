#!/usr/bin/env node
"use strict";

const path = require("path");
const process = require("process");

////
// v--- MOCKERY TRICKS
console.log("> Loading repo-local copy of @encapsule/holodeck");
const local_holodeck = require("../PACKAGES/holodeck");

console.log("> Loading repo-local copy of @encapsule/holarchy");
const local_holarchy = require("../PACKAGES/holarchy");

const mockery = require("mockery");
mockery.enable();

console.log("> Registering mock for @encapsule/holodeck");
mockery.registerMock("@encapsule/holodeck", local_holodeck);

console.log("> Registering mock for @encapsule/holarchy");
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

    "../PACKAGES/holodeck-assets",
    "./holodeck",
    "./harnesses",
    "./harness-test-1",
    "./harness-test-2",
    "./harness-test-3",
    "./harness-test-4",
    "./harness-test-5"

]);
*/

console.log("> Loading repo-local copy of @encapsule/holarchy-sml");
const local_holarchySml = require("../PACKAGES/holarchy-sml");
console.log("> Registering mock for @encapsule/holarchy-sml");
mockery.registerMock("@encapsule/holarchy-sml", local_holarchySml);

console.log("> Loading repo-local copy of @encapsule/holistic-app-client-sml");
const local_holisticAppClientSML = require("../PACKAGES/holistic-app-client-sml");
console.log("> Registering mock for @encapsule/holistic-app-client-sml");
mockery.registerMock("@encapsule/holistic-app-client-sml", local_holisticAppClientSML);

console.log("> Locating repo-local copy of @encapsule/holistic-app-server-sml");
const local_holisticAppServerSML = require("../PACKAGES/holistic-app-server-sml");
console.log("> Registering mock for @encapsule/holistic-app-server-sml");
mockery.registerMock("@encapsule/holistic-app-server-sml", local_holisticAppServerSML);

console.log("> Loading repo-local copy of @encapsule/holodeck-assets");
const local_holodeckAssets = require("../PACKAGES/holodeck-assets");
console.log("> Registering mock for @encapsule/holodeck-assets");
mockery.registerMock("@encapsule/holodeck-assets", local_holodeckAssets);

// ^--- MOCKERY TRICKS
////


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

