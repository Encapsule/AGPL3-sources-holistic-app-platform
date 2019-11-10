
const holisticTestRunner = require("../../lib/holistic-test-runner");

const testHarnessFilters = [
    require("./harness-filter-1"),
    require("./harness-filter-2")
];


const runnerResponse = holisticTestRunner.request({

    testHarnessFilters: testHarnessFilters,

    testRequestSets: [

        [
            {
                id: "IRyR4YazRuWiZp9Rzj6-WA",
                name: "Adhoc Test #1",
                description: "A quick test of the new holistic test runner, test harness factory, and test harness infrastructure.",
                expectedOutcome: "pass",
                harnessRequest: {
                    testMessage: "This request should get routed to harness-filter-1."
                }
            }
        ]

    ]

});

console.log(runnerResponse);
