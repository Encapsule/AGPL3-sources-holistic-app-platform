
const chai = require("chai");
const assert = chai.assert;

// Module under test
const { ObservableProcessController } = require("../../../PLATFORM/holarchy");

module.exports = function(testRequest_) {

    let opci = null;

    describe(`OPC Construction Test: ${testRequest_.testName}`, function() {
        before(function() {
            const constructionWrapper = function() {
                opci = new ObservableProcessController(testRequest_.opcRequest);
            }
            if (!testRequest_.opcResponse.error) {
                assert.doesNotThrow(constructionWrapper);
            } else {
                assert.throws(constructionWrapper);
            }
        });

        describe("Inspect construction response...", function() {


        });



    });


};
