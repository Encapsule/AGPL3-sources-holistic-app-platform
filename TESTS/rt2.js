#!/usr/bin/env node
"use strict";

// rt2.js (run-tests-2.js)
// Based on v2 @encapsule/holodeck
//

const path = require("path");

// Mock the platform build so we can execute the tests.
const platformInfo = require("./mock-platform");
console.log(platformInfo);

const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");

const hd2Program = require("./hd2-program");

let response = { error: null, processExit: 0, result: null };
let errors = [];
let inBreakScope = false;
while (!inBreakScope) {
    inBreakScope = true;

    /* DISABLE - WE'RE TESTING OUT INTRINSIC HARNESSES RIGHT NOW.
       ----------------------------------------------------------------
       const holodeckHarnessInstance = new holodeck.HolodeckHarness({
       });

       if (!holodeckHarnessInstance.isValid()) {
       errors.push("Unable to construct HolodeckHarness instance due to error: " + holodeckHarnessInstance.toJSON());
       }
       ----------------------------------------------------------------
    */

    const platformHolodeck = new holodeck.Holodeck({
        id: "ohHmx_oJTTSnmTCgQD788g",
        name: "Holistic Platform Holodeck Test Envirionment",
        description: "Defines holodeck instance we use to perform testing on the holistic platform RTL's.",
        logRootDir: path.join(__dirname, "hd2-logs"),
        holodeckHarnesses: [
        ]
    });

    if (!platformHolodeck.isValid()) {
        errors.push("Unable to construct Holodeck class instance due to error: " +  platformHolodeck.toJSON());
        break;
    }

    // WHAT SHOULD A HOLODECK PROGRAM LOOK LIKE IDEALLY? LET'S PLAY WHAT-IF AND THEN MAKE IT WORK THAT WAY...
    // ----------------------------------------------------------------
    const programResponse = platformHolodeck.runProgram({
        id: "GP5a-D-cRtibO5UsglJRwA",
        name: "Holistic App Platform Holodeck Program",
        description: "Test coverage for holistic app platform RTL's and tools.",
        program: hd2Program
    });
    if (programResponse.error) {
        errors.push("rt2.js runner failed w/error: " +  programResponse.error);
        break;
    }
    // ----------------------------------------------------------------

    break;

}
if (errors.length) {
    response.error = errors.join(" ");
    response.processExit = 1;
}




// ================================================================
// We now have a valid Holodeck to play with.






if (response.error) {
    console.error(response.error);
}

console.log("rt2.js PROCESS EXIT CODE: " + response.processExit);
process.exit(response.processExit);



