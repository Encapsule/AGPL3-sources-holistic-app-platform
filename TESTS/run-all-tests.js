#!/usr/bin/env node
"use strict";

const path = require("path");
const holisticTestRunner = require("./lib/holistic-test-runner");

const testHarnessFilters = [
    require("./holarchy/opc/harness-filter-1"),
    require("./holarchy/opc/harness-filter-2")
];

const runnerResponse = holisticTestRunner.request({

    id: "TxK2RjDjS2mQLkm_N8b6_Q",
    name: "Holistic Platform Test Vectors",
    description: "A suite of test vectors for exploring and confirming the behaviors of Encapsule Project holistic app platform libraries.",

    logsRootDir: path.resolve(path.join(__dirname, "test-results")),

    testHarnessFilters: testHarnessFilters,
    testRequestSets: [

        [ // HOLOTEST TESTS
            {
                id: "IRyR4YazRuWiZp9Rzj6-WA",
                name: "Adhoc Test #1",
                description: "A quick test of the new holistic test runner, test harness factory, and test harness infrastructure.",
                expectedOutcome: "pass",
                harnessRequest: {
                    testMessage: "This request should get routed to harness-filter-1."
                }
            }
        ],

        // require("./holarchy/opc/test-request-set-opc-constructor")

    ]

});

if (runnerResponse.error) {
    console.error(`! Test runner returned an error: '${runnerResponse.error}'`);
} else {
    console.log("Complete.");
}

