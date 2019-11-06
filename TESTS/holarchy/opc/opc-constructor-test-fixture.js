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
const { ObservableProcessController, ObservableControllerData } = require("../../../PLATFORM/holarchy");

/*
  {
    id: IRUT
    name: test name
    description: test description
    opcRequest: optional opc constructor request descriptor obejct
    expectedError: null | expected construction error
    expectedResults: {
        ocdRuntimeSpec: synthesize filter spec
    }
   }
*/

module.exports = function(testRequest_) {

    let opci = null;
    let opciStatusDescriptor = null;

    describe(`OPC test fixture run ${testNumber++} test id "${testRequest_.id}" // ${testRequest_.name}: ${testRequest_.description}`, function() {

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

            if (testRequest_.expectedError) {

                describe("opc construction is expected to fail and return a zombie opci", function() {

                    it("opci.isValid() is expected to return false.", function() {
                        assert.isFalse(opciStatusDescriptor.valid);
                    });

                    it("opci.isValid({ getError: true}) is expected to return construction error response object", function() {
                        assert.isObject(opciStatusDescriptor.response);
                        assert.property(opciStatusDescriptor.response, "error");
                        assert.property(opciStatusDescriptor.response, "result");
                    });

                    it("opci constructor response error should match expected value by equal comparison", function() {
                        assert.isString(opciStatusDescriptor.response.error);
                        // equal compare creates a short error and compact log of actual vs expected that's easy to cut/paste to editor for analysis, and if okay to expected error/results
                        assert.equal(opciStatusDescriptor.response.error, testRequest_.expectedError);
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
                            assert.equal(zombieCheckResponse.error, testRequest_.expectedError);
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
                            assert.equal(zombieCheckResponse.error, testRequest_.expectedError);
                        });

                    });

                    /*
                    if (opciStatusDescriptor.valid) {
                        // we expect this to be false if we're down this branch of the test
                        describe("OPCI IS NOT IN ZOMBIE STATE AS EXPECTED. Dumping instance state", function() {
                            it("OPC not in post-constructor zombie state as expected. Dumping this_.private", function() {
                                assert.deepEqual(opci._this, {});
                            });
                        });
                    }
                    */

                });


            } else {

                describe("opc construction is expected to return a valid opci", function() {

                    it("opci.isValid() should return true.", function() {
                        assert.isTrue(opciStatusDescriptor.valid);
                    });

                    it("opci constructor should not have returned a constructor error", function() {
                        assert.deepEqual(opciStatusDescriptor.response, { error: null, result: true });
                    });

                    it("opci.isValid({ getError: true }) is expected to return a response object", function() {
                        assert.isObject(opciStatusDescriptor.response);
                        assert.property(opciStatusDescriptor.response, "error");
                        assert.property(opciStatusDescriptor.response, "result");
                    });

                    if (testRequest_.expectedResults) {

                        describe("Inspecting OPC instance state against expectations.", function() {

                            it("OPCI should have a _private namespace", function() {
                                assert.property(opci, "_private");
                                assert.isObject(opci._private);
                            });

                            it("OPCI._private should have an ocdRuntimeSpec namespace and it should be an object", function() {
                                assert.property(opci._private, "ocdRuntimeSpec");
                                assert.isObject(opci._private.ocdRuntimeSpec);
                            });

                            // We perform this comparison using JSON strings because filter specs are _alway_ deserialized JSON. No functions or higher-order types in filter specs at all by design.
                            it("OPCI._private.ocdRuntimeSpec filter spec should match expected value (JSON comparison)", function() {
                                assert.equal(JSON.stringify(opci._private.ocdRuntimeSpec), testRequest_.expectedResults.ocdRuntimeSpecJSON);
                            });

                            it("OPCI._private should have an ocdi property and it should be an instance of ObservableControllerData", function() {
                                assert.property(opci._private, "ocdi");
                                assert.instanceOf(opci._private.ocdi, ObservableControllerData);
                            });

                            describe("Inspect the OCP's contained observable controller data store (OCD instance).", function() {
                                let ocdiReadNamespaceResponse = null;
                                before(function() {
                                    ocdiReadNamespaceResponse = opci._private.ocdi.readNamespace("~");
                                });

                                it("opci._private.ocdi.readNamespace(~) should have returned an object", function() {
                                    assert.isNotNull(ocdiReadNamespaceResponse);
                                    assert.isObject(ocdiReadNamespaceResponse);
                                });

                                it("opci._private.ocdi.readNamespace(~) response should be a standard filter repsonse descriptor", function() {
                                    assert.property(ocdiReadNamespaceResponse, "error");
                                });

                                it("opci._private.ocdi.readNamespace(~) should not return a response error", function() {
                                    assert.isNull(ocdiReadNamespaceResponse.error);
                                });

                                it("OPCI._private.ocdi.readNamespace(~) JSON should match expected value", function() {
                                    assert.property(ocdiReadNamespaceResponse, "result");
                                    assert.isObject(ocdiReadNamespaceResponse.result);
                                    assert.equal(JSON.stringify(ocdiReadNamespaceResponse.result), testRequest_.expectedResults.opciStateJSON);
                                });

                            });

                        });

                    }

                });

            }

        });

    });

};
