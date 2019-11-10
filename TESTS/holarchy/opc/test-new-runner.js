
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
            { filter1: { message: "hello, this is a test vector" } },
        ]
    ]
});

console.log(runnerResponse);
