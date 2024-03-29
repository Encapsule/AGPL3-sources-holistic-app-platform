// harness-filter-2.js

const holodeck = require("@encapsule/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "d8zMijUSTZiQlbk__HX6gA",

    name: "Holodeck Runner Test Harness #2",
    description: "A simple holodeck test harness filter to test out the runner.",

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage2: {
            ____accept: "jsString"
        }
    },
    testVectorResultOutputSpec: {
        ____accept: "jsString"
    },
    harnessBodyFunction: function(request_) {
        return { error: null, result: request_.vectorRequest.testMessage2 };
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

