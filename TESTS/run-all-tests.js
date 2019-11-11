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

        [ // HOLODECK RUNNER TESTS

            {
                id: "zxKqk_YOTme-e0AExJUhmg",
                name: "Bad message test #1",
                description: "Attempt to call the harness-filter-1 test harness plug-in.",
                expectedOutcome: "pass",
                harnessRequest: {
                    testMessage: { message: "Hello, is anyone there?" }
                }
            },

            {
                id: "IRyR4YazRuWiZp9Rzj6-WA",
                name: "Call test harness #1",
                description: "Attempt to call the harness-filter-1 test harness plug-in.",
                expectedOutcome: "pass",
                harnessRequest: {
                    testMessage1: "This request should get routed to harness-filter-1."
                }
            },

            {
                id: "sBB6rshGQu2f7S5rA2x9eg",
                name: "Call test harness #2",
                description: "Attempt to call the harness-filter-2 test harness plug-in.",
                expectedOutput: "pass",
                harnessRequest: {
                    testMessage2: "This request should get routed to harness-filter-2."
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

