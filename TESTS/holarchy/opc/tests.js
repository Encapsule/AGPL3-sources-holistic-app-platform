
const runner = require("./runner");

const harnessFilter1 = require("./harness-filter-1");
const harnessFilter2 = require("./harness-filter-2");

const runnerResponse = runner.request({
    testHarnessFilters: [
        harnessFilter1,
        harnessFilter2,
    ],
    testRequestSets: [
        [
            "fuck you",
            {}
        ]
    ]
});

console.log(runnerResponse);
