// harness-filter-1.js

// const arccore = require("@encapsule/arccore");
// const assert = require("../../lib/chai-assert-fascade");


const harnessFactory = require("../../lib/holistic-test-harness-factory");

const factoryResponse = harnessFactory.request({
    id:  "F1zguurrS9-fcdvLk7TCrg",
    name: "@ncapsule/holarchy OPC Test Harness",
    description: "@encapsule/holarchy OPC test harness filter for holistic test runner.",
    harnessRequestInputSpec: {
        ____types: "jsObject",
        testMessage: {
            ____accept: "jsString"
        }
    },
    harnessBodyFunction: function(reuqest_) {
        console.log("Reached the inside body function.");
        return { error: null, result: undefined };
    },
    harnessResultOutputSpec: {
        ____accept: "jsObject"
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

