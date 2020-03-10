#!/usr/bin/env node
"use strict";

// rt2.js (run-tests-2.js)
// Based on v2 @encapsule/holodeck
//

// Mock the platform build so we can execute the tests.
const platformInfo = require("./mock-platform");
console.log(platformInfo);

const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");


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
        logRootDir: __dirname,
        holodeckHarnesses: [
        ]
    });

    if (!platformHolodeck.isValid()) {
        errors.push("Unable to construct Holodeck class instance due to error: " +  holodeckInstance.toJSON());
        break;
    }

    // WHAT SHOULD A HOLODECK PROGRAM LOOK LIKE IDEALLY? LET'S PLAY WHAT-IF AND THEN MAKE IT WORK THAT WAY...
    // ----------------------------------------------------------------
    const programResponse = platformHolodeck.runProgram({
        id: "GP5a-D-cRtibO5UsglJRwA",
        name: "Holistic App Platform Holodeck Program",
        description: "Test coverage for holistic app platform RTL's and tools.",
        program: [
            {
                id: "iyZKjcvmR7OsORGfvAZtPQ",
                name: "Holodeck Package Tests",
                description: "@encapsule/holodeck RTL package tests.",
                config: {
                    package: {
                        packageName: "@encapsule/holodeck",
                        program: {
                            id: "k2NqyrK1TA-t7LrZGewUhg",
                            name: "Holodeck RTL Tests",
                            description: "Base-level regression tests for @encapsule/holodeck RTL package",
                            config: {
                                testSet: {
                                    program: [
                                        {
                                            id: "9uAsdIezSSWUKs9yDExkdg",
                                            name: "Test #1",
                                            description: "blah blah blah",
                                            test: {
                                                holistic: {
                                                    holodeck: {
                                                        constructorRequest: {
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            {
                id: "CgS0a4bPT7u4998vzQmn9Q",
                name: "Holarchy Package Tests",
                description: "@encapsule/holarchy RTL package tests.",
                config: {
                    package: {
                        packageName: "@encapsule/holarchy",
                        program: [
                            {
                                id: "J0aFcS-fR1azIjp_A2J76g",
                                name: "ControllerAction Class",
                                description: "Base-level regression tests for @encapsule/holarchy ControllerAction class.",
                                config: {
                                    class: {
                                        className: "ControllerAction",
                                        program: {
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                id: "OqTc6fE9RE6ZJTkLR07DuQ",
                name: "Holarchy CellModel Package Tests",
                description: "@encapsule/holarchy-cm RTL package tests.",
                config: {
                    package: {
                        pacakgeName: "@encapsule/holarchy-cm",
                        program: [
                        ]
                    }
                }
            },
            {
                id: "kH8KUtOzQNWtBl88rMlMtQ",
                name: "Holistic App Client CellModel Package Tests",
                description: "@encapsule/holistic-app-client-cm RTL package tests.",
                config: {
                    package: {
                        packageName: "@encapsule/holistic-app-client-cm",
                        program: [
                        ]
                    }
                }
            },
            {
                id: "EdsWkH9BTFK1SBDxGxMCUQ",
                name: "Holistic App Server CellModel Package Tests",
                description: "@encapsule/holistic-app-server-cm RTL package tests.",
                config: {
                    package: {
                        packageName: "@encapsule/holistic-app-server-cm",
                        program: [
                        ]
                    }
                }
            }
        ]
    });
    if (programResponse.error) {
        errors.push("Unable to execute holodeck program due to error: " + programResponse.error);
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



