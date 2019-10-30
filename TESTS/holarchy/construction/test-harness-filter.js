// @encapsule/holistic/TESTS/holarchy/construction/test-harness-filter.js

const arccore = require("@encapsule/arccore");
const chai = require("chai");

// Module under test
const { ObservableProcessController } = require("../../../PLATFORM/holarchy");

const filterResponse = arccore.filter.create({
    operationID: "fSvrbfvvQNabPN0xrqXYVQ",
    operationName: "@encapsule/holarchy OPC Construction Test Harness",
    operationDescription: "Allows developers to specify setup and input data to an OPC constructor and test the response against expected results.",

    inputFilterSpec: {
        ____label: "Test Request Descriptor",
        ____types: "jsObject",

        name: {
            ____label: "Test Name",
            ____accept: "jsString"
        },

        description: {
            ____label: "Test Description",
            ____accept: "jsString"
        },

        request: {
            ____label: "OPC Constructor Request",
            ____opaque: true
        },

        response: {
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

            // ================================================================

            try {

                opci =  null;

                describe(`OPC Construction Test: ${request_.name}:`, function() {

                    before(function() {

                        const constructionWrapper = function() {
                            opci = new ObservableProcessController(request_.request);
                        }
                        if (request_.response.error) {
                            // assert.doesNotThrow(


                    })


                });


                const opci = new ObservableProcessController(request_.request);

                if (request_.response.error) {
                    // We expected the constructor to fail!
                    


            } catch (constructionException_) {

            }


            // ================================================================

            break;
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

module.exports = filterResponse.result;
