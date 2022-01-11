// harness-filter-5.js

const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "TLUZ3YPUTXK8fXhh6t3-Ew",
    name: "Holodeck Runner Test #5",
    description: "A harness that that splits its request and makes two sub-harness calls via MDR that it combines and returns to its runner.",

    harnessOptions: {
        idempotent: false,
        gitDiffHunkSize: 0
    },

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage5: {
            ____types: "jsObject",
            subVectorRequestA: {
                ____accept: "jsObject" // We do not know what message the caller will pass
            },
            subVectorRequestB: {
                ____accept: "jsObject" // We do not know what message the caller will pass
            }
        }
    },

    testVectorResultOutputSpec: {
        ____opaque: true
    },

    harnessBodyFunction: function(request_) {

        // Here we want to test our ability to delegate via recursive MDR to a sub-harness.
        // Actually two of them, combine their responses, and return it as our own.

        const message = request_.vectorRequest.testMessage5;

        const harnessRequestA = { ...request_, ...message.subVectorRequestA };
        const harnessRequestB = { ...request_, ...message.subVectorRequestB };

        return {
            error: null,
            result: {
                responseA: request_.harnessDispatcher.request(harnessRequestA).result.request(harnessRequestA),
                responseB: request_.harnessDispatcher.request(harnessRequestB).result.request(harnessRequestB)
            }
        };
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
