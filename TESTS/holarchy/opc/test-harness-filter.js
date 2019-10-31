// @encapsule/holistic/TESTS/holarchy/construction/test-harness-filter.js

const arccore = require("@encapsule/arccore");
const chai = require("chai");
const assert = chai.assert;

// Module under test
const { ObservableProcessController } = require("../../../PLATFORM/holarchy");

const filterResponse = arccore.filter.create({
    operationID: "fSvrbfvvQNabPN0xrqXYVQ",
    operationName: "OPC Construction Test Runner",
    operationDescription: "Allows developers to specify setup and input data to an OPC constructor and test the response against expected results.",

    inputFilterSpec: {
        ____label: "Test Request Descriptor",
        ____types: "jsObject",

        testName: {
            ____label: "Test Name",
            ____accept: "jsString",
            ____defaultValue: "UNNAMED >:("
        },

        testDescription: {
            ____label: "Test Description",
            ____accept: "jsString",
            ____defaultValue: "N/A"
        },

        opcRequest: {
            ____label: "OPC Constructor Request",
            ____opaque: true
        },

        opcResponse: {
            ____label: "Expected Response",
            ____types: "jsObject",
            error: {
                ____accept: [ "jsNull", "jsString" ],
            },
            result: {
                ____opaque: true
            }
        }
    },

    bodyFunction: function(request_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            opci = null;

            describe(`OPC Construction Test: ${request_.testName}:`, function() {
                before(function() {
                    const constructionWrapper = function() {
                        opci = new ObservableProcessController(request_.opcRequest);
                    };
                    assert.doesNotThrow(constructionWrapper);
                });
                assert.isNotNull(opci);
            });

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}

const testHarnessFilter = filterResponse.result;


module.exports = function(testRequest_) {

    describe("OPC Construction Test Harness:", function() {
        const harnessResponse = testHarnessFilter.request(testRequest_);
        assert.isNull(harnessResponse.error);
    });


}

