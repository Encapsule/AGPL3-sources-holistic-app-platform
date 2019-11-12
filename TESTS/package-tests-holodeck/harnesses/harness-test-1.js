// harness-filter-1.js

const holodeck = require("../../../PLATFORM/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "F1zguurrS9-fcdvLk7TCrg",
    name: "Holodeck Runner Test Harness #1",
    description: "A simple holodeck test harness filter to test out the runner.",
    harnessRequestInputSpec: {
        ____types: "jsObject",
        testMessage1: {
            ____accept: "jsString"
        }
    },
    harnessBodyFunction: function(request_) {
        return { error: null, result: request_.harnessRequest.testMessage1 };
    },
    harnessResultOutputSpec: {
        ____accept: "jsString"
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

