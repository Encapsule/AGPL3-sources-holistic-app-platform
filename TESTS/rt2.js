#!/usr/bin/env node
"use strict";

// rt2.js (run-tests-2.js)
// Based on v2 @encapsule/holodeck
//

// Mock the platform build so we can execute the tests.
require("./holistic-platform-mockery");

const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");

const holodeckInstance = new holodeck.Holodeck({
    id: "ohHmx_oJTTSnmTCgQD788g",
    name: "Holistic Platform Test Envirionment",
    description: "Defines holodeck instance we use to perform testing on the holistic platform RTL's.",
    logRootDir: __dirname,
    holodeckHarnesses: [
    ]
});

if (!holodeckInstance.isValid()) {
    throw new Error("Unable to construct holodeck instance: " +  holodeckInstance.toJSON() );
}

