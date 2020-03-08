#!/usr/bin/env node
"use strict";

// rt2.js (run-tests-2.js)
// Based on v2 @encapsule/holodeck
//

// Mock the platform build so we can execute the tests.
require("./holistic-platform-mockery");

const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");


let response = { error: null, processExit: 0, result: null };
let errors = [];
let inBreakScope = false;
while (!inBreakScope) {
    inBreakScope = true;

    const holodeckInstance = new holodeck.Holodeck({
        id: "ohHmx_oJTTSnmTCgQD788g",
        name: "Holistic Platform Test Envirionment",
        description: "Defines holodeck instance we use to perform testing on the holistic platform RTL's.",
        logRootDir: __dirname,
        holodeckHarnesses: [
        ]
    });

    if (!holodeckInstance.isValid()) {
        errors.push("Unable to construct Holodeck class instance due to error: " +  holodeckInstance.toJSON());
    }

    const holodeckHarnessInstance = new holodeck.HolodeckHarness({
    });

    if (!holodeckHarnessInstance.isValid()) {
        errors.push("Unable to construct HolodeckHarness instance due to error: " + holodeckHarnessInstance.toJSON());
    }

    break;

}
if (errors.length) {
    response.error = errors.join(" ");
    response.processExit = 1;
}

if (response.error) {
    console.error(response.error);
} else {
    console.log(response.result);
}

console.log("Process exit with code " + response.processExit);
process.exit(response.processExit);



