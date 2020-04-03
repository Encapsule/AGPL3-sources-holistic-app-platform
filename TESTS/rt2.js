#!/usr/bin/env node
"use strict";

// rt2.js (run-tests-2.js)
// Based on v2 @encapsule/holodeck
//

// HACK (we will remove these from any real test program and rely on harnesses for logging
const fs = require("fs");
const path = require("path"); // need this for root log root dir

// Mock the platform build so we can execute the tests.
const platformInfo = require("./mock-platform");
console.log(platformInfo);

const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");

const hd2Program = require("./hd2-program");

(function() {

    let response = { error: null, processExit: 0 };
    let errors = [];
    let inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;

        // Construct the hd2 "environment" which pre-loads intrinsic harnesses, merges w/your custom harnesses, and subsequently
        // provides execution of an hd2 program defined as a tree or forest of harness plug-in command requests.

        const platformHolodeck = new holodeck.Holodeck({
            id: "ohHmx_oJTTSnmTCgQD788g",
            name: "Holistic Platform Holodeck Test Envirionment",
            description: "Defines holodeck instance we use to perform testing on the holistic platform RTL's.",
            logRootDir: path.join(__dirname, "hd2-logs"),
            holodeckHarnesses: []
        });

        if (!platformHolodeck.isValid()) {
            errors.push("Unable to construct Holodeck class instance due to error: " +  platformHolodeck.toJSON());
            break;
        }

        // TELL HOLODECK TO EXECUTE AN INTROSPECTION PROGRAM AND LOG THE DETAILS OF
        // IT'S INTERNAL STRUCTURE (E.G. HARNESS FACTORIES, HARNESS FILTERS, API METHOD FILTERS..)
        const harnessFilters = platformHolodeck._private.harnessFilters;
        harnessFilters.forEach((harnessFilter_) => {
            const filterDescriptor = harnessFilter_.filterDescriptor;
            const id = filterDescriptor.operationID;
            const name = filterDescriptor.operationName;
            const description = filterDescriptor.operationDescription;
            const filename = path.join(platformHolodeck._private.logRootDir, `[${id}::${name}].md` );
            const markdownResponse = holodeck.generateFilterMarkdownString({ filter: harnessFilter_ });
            if (markdownResponse.error) {
                errors.push(markdownResponse.error);
                console.error(markdownResponse.error);
            } else {
                fs.writeFileSync(filename, markdownResponse.result);
            }
        });


        // WHAT SHOULD A HOLODECK PROGRAM LOOK LIKE IDEALLY? LET'S PLAY WHAT-IF AND THEN MAKE IT WORK THAT WAY...
        // ----------------------------------------------------------------
        const programResponse = platformHolodeck.runProgram(hd2Program);

        if (programResponse.error) {
            errors.push("rt2.js runner failed w/error: " +  programResponse.error);
            break;
        }
        // ----------------------------------------------------------------

        response.result = programResponse.result;

        break;

    } // while (!inBreakScope)

    // Set the response.error string if there are any error(s) reported via arrays string array.
    if (errors.length) {
        response.error = errors.join(" ");
        response.processExit = 1;
    }

    const serializedResponse = JSON.stringify(response, undefined, 4);
    console.log(serializedResponse);


    console.log("rt2.js PROCESS EXIT CODE: " + response.processExit);
    process.exit(response.processExit);

})();
