// harness-filter-5A.js

const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "fEMk__iaS36GdSTX-2VE7A",

    name: "Holodeck Runner Test #5A",
    description: "Simple test endpoint that echos back a message.",

    harnessOptions: {
        idempotent: false,
        gitDiffHunkSize: 0
    },

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage5A: {
            ____types: "jsObject",
            message: { ____accept: "jsString" }
        }
    },

    testVectorResultOutputSpec: {
        ____opaque: true
    },

    harnessBodyFunction: function(request_) {
        return { error: null, result: request_.vectorRequest.testMessage5A.message };
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
