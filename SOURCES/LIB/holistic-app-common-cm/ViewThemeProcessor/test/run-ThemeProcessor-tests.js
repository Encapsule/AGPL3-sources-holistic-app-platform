#!/usr/bin/env node

/*
  $ node --inspect-brk test-ThemeProcessor.js
*/


// Node.js intrinsic RTL packages.
const path = require("path");
const process = require("process");

// Holistic RTL packages.
const holodeck = require("@encapsule/holodeck");
const holodeckAssets = require("@encapsule/holodeck-assets");

let factoryResponse = holodeck.runnerFilter.request({
    id: "zo1Zq8MhSC6llzYIb12U_A",
    name: "ThemeProcessor Holodeck v1 Environment Runner",
    description: "Throw-away v1 holodeck environment for experimenting w/ThemeProcessor CellModel.",
    logsRootDir:  path.resolve(path.join(__dirname, "logs")),
    testHarnessFilters: [
        ...holodeckAssets.holarchy.harnesses // This contains all the v1 harnesses to test all the exposed API surfaces of @encapsule/holarchy RTL
    ],

    testRequestSets: [ require("./ThemeProcessor-vector-set") ]

});

if (factoryResponse.error) {
    console.error(factoryResponse.error);
    process.exit(1); // And, we're out (process exit status !== 0 is conventionally used to indicate process exit with error).
}