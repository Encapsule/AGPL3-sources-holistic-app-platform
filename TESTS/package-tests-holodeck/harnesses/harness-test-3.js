// harness-filter-3.js

const holodeck = require("../../../PLATFORM/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "EmU3C0AASciHnBpz-xMmgA",
    name: "Holodeck Runner Test Harness #3",
    description: "A simple holodeck test harness filter to test out the runner.",
    harnessRequestInputSpec: {
        ____types: "jsObject",
        testMessage3: {
            ____types: "jsObject",
            message: {
                ____accept: "jsString"
            }
        }
    },
    harnessBodyFunction: function(request_) {
        if (request_.harnessRequest.testMessage3.message === "error") {
            return { error: "We were asked to report an error." };
        }
        return { error: null, result: request_.harnessRequest.testMessage3.message };
    },
    harnessResultOutputSpec: {
        ____accept: "jsString"
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

