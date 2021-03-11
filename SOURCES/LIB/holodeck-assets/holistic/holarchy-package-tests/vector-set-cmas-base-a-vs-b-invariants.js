// vector-set-cmas-base-a-vs-b-invariants.js

(function() {

    const vectorSetName = "CellModelArtifactSpace A vs B Instance Comparison";


    module.exports = [

        {
            id: "i6wO5eyNQvWLlyCjjr_AAA",
            name: `${vectorSetName}: Harness Smoke Test 1`,
            description: "Test case #1 to check the A vs B harness itself.",
            vectorRequest: {
                holistic: {
                    holarchy: {
                        CellModelArtifactSpace_Compare_A_vs_B: {

                            constructorRequestA: { spaceLabel: "TestA" },
                            constructorRequestB: { spaceLabel: "TestB" },
                            assertSameArtifactSpace: false,
                            mapLabelsRequest: {
                                A: {
                                    methodRequest: { CM: "test_label_1" },
                                    assertValidRequest: true
                                },
                                B: {
                                    methodRequest: { CM: "test_label_1" },
                                    assertValidRequest: true
                                },
                                assertRequestsIdentical: true
                            },
                            testAssertion: {
                                description: "CellModel ID's for same CM label string in two different CMAS should not be equal.",
                                assertionFunction: function({ testVectorRequest, cmasRefA, cmasRefB, mapLabelsRequestA, mapLabelsResultA, mapLabelsRequestB, mapLabelsResultB, assertDescription }) {
                                    return testVectorRequest.chaiAssert.notEqual(mapLabelsResultA.CMID, mapLabelsResultB.CMID, assertDescription);
                                }
                            }

                        }
                    }
                }
            }
        }

    ];


})();

