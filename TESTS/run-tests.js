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

console.log("> Loading repo-local copy of @encapsule/holarchy-cm");
const local_holarchyCM = require("../PACKAGES/holarchy-cm");
console.log("> Registering mock for @encapsule/holarchy-cm");
mockery.registerMock("@encapsule/holarchy-cm", local_holarchyCM);

console.log("> Loading repo-local copy of @encapsule/holistic-app-client-cm");
const local_holisticAppClientCM = require("../PACKAGES/holistic-app-client-cm");
console.log("> Registering mock for @encapsule/holistic-app-client-cm");
mockery.registerMock("@encapsule/holistic-app-client-cm", local_holisticAppClientCM);

console.log("> Locating repo-local copy of @encapsule/holistic-app-server-cm");
const local_holisticAppServerCM = require("../PACKAGES/holistic-app-server-cm");
console.log("> Registering mock for @encapsule/holistic-app-server-cm");
mockery.registerMock("@encapsule/holistic-app-server-cm", local_holisticAppServerCM);

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

