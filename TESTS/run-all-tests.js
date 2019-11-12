#!/usr/bin/env node
"use strict";

const path = require("path");
const holisticTestRunner = require("./lib/holistic-test-runner");

const testHarnessFilters = [
    require("./holarchy/opc/harness-filter-1"),
    require("./holarchy/opc/harness-filter-2"),
    require("./holarchy/opc/harness-filter-3")
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
            },

            {
                id: "ak8rhTiORTWXueau74RlHA",
                name: "Call test harness #3 (incomplete message)",
                description: "Attempt to call the harness-filter-3 test harness plug-in w/incomplete request mesage.",
                expectedOutput: "pass",
                harnessRequest: {
                    testMessage3: {
                        superflous: [
                            "This array is not included in the harness-filter-3 test harness input spec so it's simply clipped off by the harness input filter stage and never passed to the harness bodyFunction.",
                            "We know that our harness filter test examples all have a fairly predictable harnessRequest signature. Here we use knowledge of how arccore.discriminator works inside to craft a",
                            "a test that routes through discriminator to select the harness. But, when called the harness rejects the harnessRequest because although it was sufficient to get through arccore.discrminator,",
                            "(because after seeing testMessage3 discrminator knows it can only be harness-filter-3) it was nonetheless insufficiently complete to pass harness input spec."
                        ]
                    }
                }
            },

            {
                id: "cQ3Z1fhsTICqkY3uKQXaFQ",
                name: "Call test harness #3 (complete message signalling force error)",
                description: "Attempt to call harness-filter-3 signalling that its implementation should return a response.error.",
                expectedOutput: "pass",
                harnessRequest: { testMessage3: { message: "error" } }
            },

            {
                id: "LC56jkxeQJ2mgWfwGklLEQ",
                name: "Call test harness #3 (valid message)",
                description: "Attempt to call harness-filter-3 with a valid message.",
                expectedOutput: "pass",
                harnessRequest: { testMessage3: { message: "This message should be delivered and returned by harness-filter-3." } }
            },

        ],

        // require("./holarchy/opc/test-request-set-opc-constructor")

    ]

});

if (runnerResponse.error) {
    console.error(`! Test runner returned an error: '${runnerResponse.error}'`);
} else {
    console.log("Complete.");
}

