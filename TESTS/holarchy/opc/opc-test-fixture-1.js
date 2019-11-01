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
    let opciStatusDescriptor = null;

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
                opciStatusDescriptor = {
                    valid: opci.isValid(),
                    response: opci.isValid({ getError: true })
                };
            });

            it("Confirm standard opci validity API is working as expected.", function() {
                assert.isNotNull(opciStatusDescriptor);
                assert.isObject(opciStatusDescriptor);
                assert.property(opciStatusDescriptor, "valid");
                assert.isBoolean(opciStatusDescriptor.valid);
                assert.property(opciStatusDescriptor, "response");
                assert.isObject(opciStatusDescriptor.response);
                assert.property(opciStatusDescriptor.response, "error");
                assert.property(opciStatusDescriptor.response, "result");
            });

            if (testRequest_.opciResponse.error) {

                describe("opc construction is expected to fail and return a zombie ocpi", function() {

                    it("opci.isValid() is expected to return false.", function() {
                        assert.isFalse(opciStatusDescriptor.valid);
                    });

                    it("opci.isValid({ getError: true}) is expected to return construction error response object", function() {
                        assert.isObject(opciStatusDescriptor.response);
                        assert.property(opciStatusDescriptor.response, "error");
                        assert.property(opciStatusDescriptor.response, "result");
                    });

                    it("opci constructor response error should match expected value", function() {
                        assert.isString(opciStatusDescriptor.response.error);
                        assert.equal(opciStatusDescriptor.response.error, testRequest_.opciResponse.error);
                    });

                    it("opci constructor response result should be false", function() {
                        assert.isBoolean(opciStatusDescriptor.response.result);
                        assert.isFalse(opciStatusDescriptor.response.result);
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

                });


            } else {

                describe("opc construction is expected to return a valid opci", function() {

                    it("opci.isValid() should return true.", function() {
                        assert.isTrue(opciStatusDescriptor.valid);
                    });

                    it("opci.isValid({ getError: true }) is expected to return a response object", function() {
                        assert.isObject(opciStatusDescriptor.response);
                        assert.property(opciStatusDescriptor.response, "error");
                        assert.property(opciStatusDescriptor.response, "result");
                    });


                });

            }

        });

    });

};
