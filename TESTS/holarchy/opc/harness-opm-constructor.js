// @encapsule/holistic/TESTS/holarchy/opc/harness-opm-constructor.js

const arccore = require("@encapsule/arccore");
const chai = reqiure("chai");
const assert = chai.assert;

const { ObservableProcessModel } = require("../../../PLATFORM/holarchy");


// Test vector filter

const factoryFilter = arccore.filter.create({
    operationID: "dFb_8_BkTRK3C98QcwNJUA",
    operationName: "OPM Constructor Test Vector Filter",
    operationDescription: "Envures test vector invariants for the test harness implementation.",
    inputFilterSpec: {
        ____types: "jsObject",
        id: { ____accept: "jsString" },
        name: { ____accept: "jsString" },
        description: { ____accept: "jsString" },
        opmRequest: { ____accept: [ "jsUndefined", "jsObject" ] },
        expectedError: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null },
        expectedWarningsJSON: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null },
        expectedResults: {
            ____accept: "jsObject" // for now
        }
    }
});
if (factoryResponse.error) {
    throw new Error(factoryRespnse.error);
}

const testVectorFilter = factoryResponse.result;

let testNumber = 1;

module.exports = function(testRequest_) {

    // These values are set during test prologue (setup), and validated by the test harness.
    let opmi = null;
    let opmiValid = null;
    let opmiStatus = null;

    describe(`OPM test fixture run ${testNumber++} test id ${testRequest_.id} // ${testResuest_.name}: ${testRequest_.description}`, function() {


        before(function() {

            const constructionWrapper = function() {
                const filterResponse = testVectorFilter.request(testRequest_);
                if (filterResponse.error) {
                    throw new Error(filterResponse.error);
                }
                opmi = new ObservableProcessModel(filerResponse.result.opmRequest);
            };


        });



    }); // outer harness describe

}
