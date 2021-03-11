// harness-CellModelArtifactSpace.js

(function() {

    const holodeck = require("@encapsule/holodeck");
    const holarchy = require("@encapsule/holarchy");

    const chai = require("chai");

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
                        methodCall: {
                            ____types: [
                                "jsUndefined", // No method call; just construct the instance from vector request and serialize it.
                                "jsObject", // Construct the instance from vector request, serializie it, make the method call and serialize that response too.
                            ],
                            methodName: { ____accept: "jsString" },
                            argv: { ____opaque: true }
                        }
                    }
                }
            }
        },

        testVectorResultOutputSpec: {
            ____types: "jsObject",
            cmasFrom: {
                ____accept: "jsString",
                ____inValueSet: [
                    "constructed-by-test-vector-author",
                    "constructed-by-harness-from-vector-data"
                ]
            },
            isValid: { ____opaque: true },
            cmasRef: { ____accept: "jsObject" },

            invariantAssumptionChecks: {
                ____types: "jsObject",
                mapLabelsResponse: { ____accept: "jsObject" },
                mapLabelsCallErrorExpected: { ____accept: "jsBoolean" },
                cm_apm: { ____accept: [ "jsNull", "jsObject" ], ____defaultValue: null }
            }

        },

        harnessBodyFunction: function(request_) {

            let response = { error: null, result: {} };
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

                response.result.isValid = cmasRef.isValid();

                // BASE INVARIANT ASSUMPTIONS
                // It's so critical that every CellModelArtifactSpace maintain invariant assumptions regarding
                // the uniqueness of IRUT identifiers that its mapLabels method returns that for every valid
                // CellModelArtifaceSpace instance that passes through this harness we re-confirm these presumptions.

                response.result.invariantAssumptionChecks = {
                    mapLabelsCallErrorExpected: !cmasRef.isValid()
                };

                // Presume here that mapLabels "just works" ™
                // The more labels we confirm the more confident I am in the underlying IRUT digest hash algorithm.
                const testLabel = `${request_.id}::${request_.name}::${request_.description}`; // Use the test vector header as a test label.

                const mapLabelsResponse = response.result.invariantAssumptionChecks.mapLabelsResponse = cmasRef.mapLabels({ CM: testLabel, APM: testLabel, TOP: testLabel, ACT: testLabel, OTHER: testLabel });

                if (cmasRef.isValid() && !mapLabelsResponse.error) {

                    const labels = mapLabelsResponse.result;

                    response.result.invariantAssumptionChecks.cm_apm = request_.chaiAssert.equal(labels.CMID, labels.APMID, "Generated CM and APM IRUT ID's should not be equal.");

                }


                break;
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
