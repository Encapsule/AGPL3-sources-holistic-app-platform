// harness-filter-5.js

const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "TLUZ3YPUTXK8fXhh6t3-Ew",
    name: "Holodeck Runner Test #5",
    description: "A harness that generates random output (i.e. not idempotent) to test holodeck's ability to derive stable diff hunk markers.",

    harnessOptions: {
        idempotent: false,
        gitDiffHunkSize: 0
    },

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage5: {
            ____accept: "jsObject"
        }
    },

    testVectorResultOutputSpec: {
        ____opaque: true
    },

    harnessBodyFunction: function(request_) {

        const result = [];
        while (result.length < 10) {
            result.push(arccore.identifier.irut.fromEther());
        }
        return { error: null, result };
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
