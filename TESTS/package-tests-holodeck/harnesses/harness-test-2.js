// harness-filter-2.js

const harnessFactory = require("../../lib/holistic-test-harness-factory");

const factoryResponse = harnessFactory.request({
    id: "d8zMijUSTZiQlbk__HX6gA",

    name: "Holodeck Runner Test Harness #2",
    description: "A simple holodeck test harness filter to test out the runner.",
    harnessRequestInputSpec: {
        ____types: "jsObject",
        testMessage2: {
            ____accept: "jsString"
        }
    },
    harnessBodyFunction: function(request_) {
        return { error: null, result: request_.harnessRequest.testMessage2 };
    },
    harnessResultOutputSpec: {
        ____accept: "jsString"
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

