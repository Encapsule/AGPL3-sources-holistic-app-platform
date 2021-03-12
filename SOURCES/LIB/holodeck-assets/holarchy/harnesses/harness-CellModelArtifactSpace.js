// harness-CellModelArtifactSpace.js

(function() {

    const holodeck = require("@encapsule/holodeck");
    const holarchy = require("@encapsule/holarchy");

    const factoryResponse = holodeck.harnessFactory.request({

        id: "PKqr3AM2TeapNhvzxh8_0g",
        name: "CellModelArtifact Test Harness",
        description: "Constructs an instance of ES6 class CellModelArtifaceSpace from vector request data, serializes it post-construction, optionally call a method on the instance and log the response.",

        // idempotent class does not mutute its state post-construction

        testVectorRequestInputSpec: {
            ____types: "jsObject",
            holistic: {
                ____types: "jsObject",
                holarchy: {
                    ____types: "jsObject",
                    CellModelArtifactSpace: {
                        ____types: "jsObject",

                        constructorRequest: { ____opaque: true },

                        assertValidInstance: { ____accept: "jsBoolean" },

                        methodCall: {
                            ____types: [
                                "jsUndefined", // No method call; just construct the instance from vector request and serialize it.
                                "jsObject", // Construct the instance from vector request, serializie it, make the method call and serialize that response too.
                            ],
                            methodName: { ____accept: "jsString" },
                            methodRequest: { ____opaque: true },
                            assertValidReqeust: { ____accept: "jsBoolean" }
                        },

                        /*
                          If you specify methodCall descriptor, then the harness will call the specified methodName on the CMAS instance under test passing methodRequest as the request.

                          You may optionally provide an assertionFunction:

                          const assertFnResponse = assertionFunction({ testVectorRequest, cmasRef, methodResponse });

                          You should return a standard arccore.filter response descriptor object.

                          If you return response.error the harness will mark the current test vector evaluation as FAILED.

                          If you return response.result then it is expected to be a chaiAssert result descriptor object.

                        */

                        testAssertion: {
                            ____types: [ "jsUndefined", "jsObject" ],
                            description: { ____accept: "jsString" },
                            assertionFunction: { ____accept: "jsFunction" }
                        }
                    }
                }
            }
        },

        testVectorResultOutputSpec: {
            ____types: "jsObject",

            vectorFailed: { ____accept: "jsBoolean", ____defaultValue: false },
            vectorFailedReason: { ____accept: [ "jsUndefined", "jsString" ] },

            cmasFrom: {
                ____accept: "jsString",
                ____inValueSet: [
                    "constructed-by-test-vector-author",
                    "constructed-by-harness-from-vector-data"
                ]
            },

            cmasRef: { ____accept: "jsObject" },

            invariantAssumptionChecks: {
                ____types: "jsObject",

                mapLabelsResponse: { ____accept: [ "jsUndefined", "jsObject" ] },
                mapReverse: { ____types: ["jsNull", "jsObject" ], ____defaultValue: null, ____asMap: true, irutID:  { ____accept: "jsString" } },
                collisions: { ____types: ["jsNull", "jsArray" ], ____defaultValue: null, element: { ____accept: "jsString" } },
            },

            assertions: {
                ____types: "jsArray",
                ____defaultValue: [],
                chaiAssertResult: { ____accept: "jsObject" } // TODO spec this out --- I think it's stable? At least as much of the structure that we specify in the fascade wrapper.
            },

            assertFailures: {
                ____types: "jsArray",
                ____defaultValue: [],
                failureIndex: { ____accept: "jsNumber" } // When we call chaiAssert we push the result (a result not a filter response) to assertions array. If the result indicates the assertion failed, then we also push the index of the failed assertion in assertions array into assertFailures array.
            }

        },

        harnessBodyFunction: function(request_) {

            let response = { error: null, result: { assertions: [], assertFailures: [], invariantAssumptionChecks: {} } };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                const messageBody = request_.vectorRequest.holistic.holarchy.CellModelArtifactSpace;

                // CONSTRUCTION

                // Get a @encapsule/holarchy CellModelArtifact class instance to test.

                if (messageBody.constructorRequest instanceof holarchy.CellModelArtifactSpace) {
                    response.result.cmasRef = messageBody.constructorRequest;
                    response.result.cmasFrom = "constructed-by-test-vector-author";
                } else {
                    response.result.cmasRef = new holarchy.CellModelArtifactSpace(messageBody.constructorRequest);
                    response.result.cmasFrom = "constructed-by-harness-from-vector-data";
                }

                // POST-CONSTRUCTION

                // Perform base level instance check of validation.
                // Stash the raw reference to the instance under test.
                // - Holodeck will call its toJSON method when it serializes our response object to eval log file.
                // - Derived test harnesses may chain to this harness to contruct a CellModelArtifactSpace instance.

                const cmasRef = response.result.cmasRef; // local alias just to save typing

                while (!response.result.assertFailures.length) {

                    let assertResult, assertionsLength;

                    // CHECK CONSTRUCTION INVARIANTS BEFORE PROCEEDING

                    if (messageBody.assertValidInstance) {
                        assertResult = request_.chaiAssert.isTrue(cmasRef.isValid(), "The CMAS instance created from constructorRequest is expected to be a valid instance according to the test vector.");
                        assertionsLength = response.result.assertions.push(assertResult);
                        if (assertResult.assertion) {
                            response.result.assertFailures.push(assertionsLength - 1);
                            break;
                        }
                    } else {
                        assertResult = request_.chaiAssert.isFalse(cmasRef.isValid(), "The CMAS instance created from constructorRequest is expected to be invalid per the test vector.");
                        assertionsLength = response.result.assertions.push(assertResult);
                        if (assertResult.assertion) {
                            response.result.assertFailures.push(assertionsLength - 1);
                            break;
                        }
                    }

                    // BASE INVARIANT ASSUMPTIONS

                    // It is critical that every CellModelArtifactSpace maintain invariant assumptions regarding
                    // the uniqueness of IRUT identifiers returned by mapLabels method. So, every time this harness gets
                    // its hands on a valid CMAS instance, it checks to make sure that the CMAS instance really does
                    // produce unique labels within its own scope. No test of this sort can prove that this assumption
                    // holds true for all possible inputs. But, this will be good enough to sort obvious problems due
                    // to sloppy coding (as opposed to things tracking back to the random distribution of the digest
                    // hashing algorithm implemented by arccore.identifier.irut.


                    if (cmasRef.isValid()) {

                        // Take over and run base invariant test on IRUT's created in the CMAS instance's scope.

                        // Presume here that mapLabels "just works" ™
                        // The more labels we confirm the more confident I am in the underlying IRUT digest hash algorithm.
                        const testLabel = `${request_.id}::${request_.name}::${request_.description}`; // Use the test vector header as a test label.

                        const mapLabelsResponse = response.result.invariantAssumptionChecks.mapLabelsResponse = cmasRef.mapLabels({ CM: testLabel, APM: testLabel, TOP: testLabel, ACT: testLabel, OTHER: testLabel });

                        assertResult = request_.chaiAssert.isObject(mapLabelsResponse, "We expect cmasRef.mapLabels to return an object when the instance is valid and the the request is also valid (which it is).");
                        assertionsLength = response.result.assertions.push(assertResult);
                        if (assertResult.assertion) {
                            response.result.assertFailures.push(assertionsLength - 1);
                            break;
                        }

                        assertResult = request_.chaiAssert.isNull(mapLabelsResponse.error, "We expect cmasRef.mapLabels to return response.error === null when the instance is valid the the request is also valid (which it is).");
                        assertionsLength = response.result.assertions.push(assertResult);
                        if (assertResult.assertion) {
                            response.result.assertFailures.push(assertionsLength - 1);
                            break;
                        }

                        const labels = mapLabelsResponse.result;
                        const spaceID = cmasRef.getArtifactSpaceID();
                        let collisions = [];
                        let mapReverse = {};

                        Object.keys(labels).forEach((key_) => {
                            if (!key_.endsWith("ID")) {
                                const idKey = `${key_}ID`;
                                const idValue = labels[idKey];
                                if (idValue === spaceID) {
                                    collisions(key_);
                                }
                                if (mapReverse[idValue]) {
                                    collisions.push(key_);
                                } else {
                                    mapReverse[idValue] = labels[key_];
                                }
                            }
                        });

                        response.result.invariantAssumptionChecks.collisions = collisions;
                        response.result.invariantAssumptionChecks.mapReverse = mapReverse;

                        assertResult = request_.chaiAssert.isEmpty(collisions, "We expect there to be no collisions between IRUT ID's generated w/the same label string value inside of a CMAS instance scope!");
                        assertionsLength = response.result.assertions.push(assertResult);
                        if (assertResult.assertion) {
                            response.result.assertFailures.push(assertionsLength - 1);
                            break;
                        }

                    } // If we have a valid CMAS instance to torture...

                    break;

                } // while not assert failures

                break;
            }

            if (response.result.assertFailures.length) {
                response.result.vectorFailed = true;
            }

            if (errors.length) {
                response.error = errors.join(" ");
            }

            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();
