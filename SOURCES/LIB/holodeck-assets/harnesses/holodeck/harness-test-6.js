// harness-filter-6.js

const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "OLdqtYwjToetbonB-pSRyw",

    name: "Holodeck Runner Test #6",
    description: "A harness that creates a new runner with two vectors as a peer runner eval log directory.",

    harnessOptions: {
        idempotent: false,
        gitDiffHunkSize: 0
    },

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage6: {
            ____types: "jsObject",
            subRunnerID: {
                ____accept: "jsString" // An IRUT for the child runner
            },
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

        const message = request_.vectorRequest.testMessage6  ;

        const harnessRequestA = { ...request_, ...message.subVectorRequestA };
        const harnessRequestB = { ...request_, ...message.subVectorRequestB };

        return request_.harnessRunner.request({
            ...request_,
            id: message.subRunnerID,
            name: "Test Subrunner #1",
            description: "Test to see if we can launch another runner from within a harness.",
            testRequestSets: [
                [ message.subVectorRequestA, message.subVectorRequestB ]
            ]
        });

    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
