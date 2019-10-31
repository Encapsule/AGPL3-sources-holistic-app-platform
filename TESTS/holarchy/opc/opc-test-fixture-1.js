// @encapsule/holistic/TESTS/holarchy/opc/opc-test-fixture-1.js
//
// A "fixture" is a function that performs a battery of tests on a
// module under test. Here the module is ObservableProcessController
// ES6 class exported from @encapsule/holarchy package.
//
// Note the this module depends implicitly on symbols defined
// when it is executed under mocha. It will fail if you run it
// straight out w/node. Luckily, mocha supports --inspect-brk
//

const chai = require("chai");
const assert = chai.assert;

let testNumber = 1;

// Module under test
const { ObservableProcessController } = require("../../../PLATFORM/holarchy");

module.exports = function(testRequest_) {

    let opci = null;
    let opciConstructorResponse = null;

    describe(`ObservableProcessController Test Harness Test ${testNumber++} :: name: "${testRequest_.name}" description: "${testRequest_.description}"`, function() {

        before(function() {
            const constructionWrapper = function() {
                opci = new ObservableProcessController(testRequest_.opcRequest);
            }
            assert.doesNotThrow(constructionWrapper);
        });

        it("Operator new should have returned a new ObservableProcessController instance (opci).", function() {
            assert.isNotNull(opci);
            assert.instanceOf(opci, ObservableProcessController);
        });

        describe("Insepct newly-constructed opci", function() {

            before(function() {
                opciConstructorResponse = {
                    valid: opci.isValid(),
                    response: opci.isValid({ getError: true })
                };
            });

            it("Confirm standard opci validity API is working as expected.", function() {
                assert.isNotNull(opciConstructorResponse);
                assert.isObject(opciConstructorResponse);
                assert.property(opciConstructorResponse, "valid");
                assert.isBoolean(opciConstructorResponse.valid);
                assert.property(opciConstructorResponse, "response");
                assert.isObject(opciConstructorResponse.response);
                assert.property(opciConstructorResponse.response, "error");
                assert.property(opciConstructorResponse.response, "result");
            });

            if (testRequest_.opciResponse.error) {

                describe("opci is expected to have failed during construction per definition of this test. examining...", function() {

                    it("opci is expected to be invalid.", function() {
                        assert.isFalse(opciConstructorResponse.valid);
                    });

                    it("opci is expected to report constructor error response", function() {
                        assert.isString(opciConstructorResponse.response.error);
                        assert.isBoolean(opciConstructorResponse.response.result);
                    });

                    it("opci constructor response error should match expected value", function() {
                        assert.equal(opciConstructorResponse.response.error, testRequest_.opciResponse.error);
                    });

                    it("opci constructor resposne result should be false", function() {
                        assert.isFalse(opciConstructorResponse.response.result);
                    });

                });

                let zombieCheckResponse = null;

                describe("opci zombie public toJSON method check", function() {

                    before(function() {
                        zombieCheckResponse = opci.toJSON();
                    });

                    it("opci zombie method is expected to have returned a response object", function() {
                        assert.isObject(zombieCheckResponse);
                        assert.property(zombieCheckResponse, "error");
                        assert.property(zombieCheckResponse, "result");
                    });

                    it("opci zombie method response result should be false", function() {
                        assert.isBoolean(zombieCheckResponse.result);
                        assert.isFalse(zombieCheckResponse.result);
                    });

                    it("opci zombie method response error should match expected", function() {
                        assert.isString(zombieCheckResponse.error);
                        assert.equal(zombieCheckResponse.error, testRequest_.opciResponse.error);
                    });

                });

                describe("opci zombie public act method check", function() {

                    before(function() {
                        zombieCheckResponse = opci.act();
                    });

                    it("opci zombie method is expected to have returned a response object", function() {
                        assert.isObject(zombieCheckResponse);
                        assert.property(zombieCheckResponse, "error");
                        assert.property(zombieCheckResponse, "result");
                    });

                    it("opci zombie method response result should be false", function() {
                        assert.isBoolean(zombieCheckResponse.result);
                        assert.isFalse(zombieCheckResponse.result);
                    });

                    it("opci zombie method response error should match expected", function() {
                        assert.isString(zombieCheckResponse.error);
                        assert.equal(zombieCheckResponse.error, testRequest_.opciResponse.error);
                    });

                });


            } else {

                it("The new OCPI is expected to be valid. Confirm this.", function() {
                    assert.isTrue(opci.isValid());
                });
                it("The new OCPI is expected to return expected extended validity response data.", function() {
                    assert.deepEqual(opci.isValid({ getError: true }), {}, "Actual vs. expected value failure.");
                });
            }
        });

    });


};
