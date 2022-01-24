
const cppTestFixtureCellModel = require("./fixture-cpm");

const cppTestModelSpace = require("./fixture-cpm/cellspace");

const holarchy = require("@encapsule/holarchy");

module.exports = [

    {
        id: "kZ5M4SOwRdOWp_zWumRtYg",
        name: "CPM Shared Process Test #1",
        description: "A Cell Process Proxy unit test.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "kZ5M4SOwRdOWp_zWumRtYg",
                            name: "CPM Cell Process Proxy Test #1",
                            description: "A Cell Process Proxy unit test.",
                            cellmodel: cppTestFixtureCellModel.getArtifact({ type: "CM", id: cppTestModelSpace.cmID("CPP Test 1") }).result
                        },

                        testActorRequests: [

                            // ================================================================
                            {
                                actRequest: {
                                    actorName: "CPM Cell Process Proxy Test #1",
                                    actorTaskDescription: "Instantiate test process that embeds a process proxy worker process.",
                                    actionRequest: { CellProcessor: { process: { activate: { /*default processData*/ }, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 1"), instanceName: "Test Process A" } } } }
                                }
                            },

                            // ================================================================
                            {
                                options: { failTestIf: { CellProcessor: { actionError: "fail-if-action-result" } } },
                                actRequest: {
                                    actorName: "CPM Cell Process Proxy Test #1",
                                    actorTaskDescription: "Attempt to delete the newly created shared process (should fail).",
                                    actionRequest: { CellProcessor: { process: { deactivate: {}, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 1"), instanceName: "Test Process B" } } } }
                                }
                            },

                            // ================================================================
                            {
                                actRequest: {
                                    actorName: "CPM Cell Process Proxy Test #1",
                                    actorTaskDescription: "Attempt to delete the original test process (should succeed).",
                                    actionRequest: { CellProcessor: { process: { deactivate: {}, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 1"), instanceName: "Test Process A" } } } }
                                }
                            }
                        ]
                    }
                }
            }
        }
    },

    {
        id: "FSTf8ckWTFmm-qGt6lvIsA",
        name: "CPM Shared Process Test #2",
        description: "Start verifying that some simple CellModels that include CellProxy helpers work correctly when used as helpers, owned, and shared processes alike.",
        vectorRequest: {
            description: "Verify that CPP Test 2 APM is able to connect it's top-level proxy helper to shared test messenger shared cell process.",
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "FSTf8ckWTFmm-qGt6lvIsA",
                            name: "CPM Shared Process Test #2",
                            description: "Start verifying that some simple CellModels that include CellProxy helpers work correctly when used as helpers, owned, and shared processes alike.",
                            cellmodel: cppTestFixtureCellModel.getArtifact({ type: "CM", id: cppTestModelSpace.cmID("CPP Test 2") }).result
                        },

                        actRequests: [
                            {
                                actorName: "CPM Shared Process Test #2",
                                actorTaskDescription: "Start a test process.",
                                actionRequest: { CellProcessor: { process: { activate: { /* default processData */ },  processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 2") } } } }
                            },
                            {
                                actorName: "CPM Shared Process Test #2",
                                actorTaskDescription: "Delete the test process.",
                                actionRequest: { CellProcessor: { process: {  deactivate: {}, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 2") } } } }
                            }
                        ]
                    }
                }
            }
        }
    },

    {
        id: "QiSQnxzURSa4aVk_0PZGnQ",
        name: "CPM Shared Process Test #3",
        description: "Can we use a cell that uses a proxy as a helper? NO! WE CANNOT DO THIS YET. THIS IS PLANNED FOR v0.0.49.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "QiSQnxzURSa4aVk_0PZGnQ",
                            name: "CPM Shared Process Test #3",
                            description: "Can we use a cell that uses a proxy as a helper?",
                            cellmodel: cppTestFixtureCellModel.getArtifact({ type: "CM", id: cppTestModelSpace.cmID("CPP Test 3") }).result
                        },

                        testActorRequests: [

                            {
                                // TODO: THIS IS WRONG! THIS TEST SHOULD PASS. THERE IS WHERE I LEFT OFF WHEN I WENT TO LOCK DOWN CELLPROCESS TEST HARNESS
                                options: { failTestIf: { CellProcessor: { evaluateError: "fail-if-opc-no-errors" } } },
                                actRequest: {
                                    actorName: "CPM Shared Process Test #3",
                                    actorTaskDescription: "Start a test process.",
                                    actionRequest: { CellProcessor: { process: { activate: { /* default processData */ }, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 3") } } } }
                                }
                            },

                            {
                                actRequest: {
                                    actorName: "CPM Shared Process Test #3",
                                    actorTaskDescription: "Delete a test process.",
                                    actionRequest: { CellProcessor: { process: { deactivate: {}, processCoordinates: { apmID: cppTestModelSpace.apmID("CPP Test 3") } } } }
                                }
                            }

                        ]
                    }
                }
            }
        }
    },

    {
        id: "aRXQIZvdSE2rVnqR0HrfYg",
        name: "CPM Shared Process Test #4",
        description: "Coming back to this and taking a closer look at CellProcessProxy (CPP) (part 1).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "mtzaOOxAQcaaN_-9CqgZOw", // This is a the CellProcessor instance ID
                            name: "CPM Shared Process Test #4",
                            description: "Try to use a CellProcessProxy cell embedded as a helper in a parent cell process (part 1).",
                            cellmodel: {
                                id: "xXfx_svjT363tD-optUHog", // This is a the CellModel instance ID
                                name: "CellModel for aRXQIZvdSE2rVnqR0HrfYg Test",
                                description: "A top-level CellModel instance for test aRXQIZvdSE2rVnqR0HrfYg.",
                                apm: {
                                    id: "TQ0j4BIhRQu5SmS-cWxJvQ", // AbstractProcessModel instance ID
                                    name: "AbstractProcessModel for aRXQIZvdSE2rVnqR0HrfYg Test",
                                    description: "A top-level AbstractProcessModel for test aRXQIZvdSE2rVnqR0HrfYg.",
                                    ocdDataSpec: {
                                        ____types: "jsObject",
                                        ____defaultValue: {},
                                        testNamespace1: {
                                            ____types: "jsObject",
                                            ____defaultValue: {},
                                            testNamespace2: holarchy.appTypes.helperCells.cellProcessProxy
                                        }
                                    }
                                }
                            }
                        },
                        testActorRequests: [

                            {
                                actRequest: {
                                    actorName: "Test aRXQIZvdSE2rVnqR0HrfYg",
                                    actorTaskDescription: "Activate test cell.",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                activate: {},
                                                processCoordinates: { apmID: "TQ0j4BIhRQu5SmS-cWxJvQ", instanceName: "root-instance" }
                                            }
                                        }
                                    }
                                }
                            },

                            /*
                            {
                                actRequest: {
                                    actorName: "Test aRXQIZvdSE2rVnqR0HrfYg",
                                    actorTaskDescription: "Attempt to connect a Cell Process Proxy helper cell that's declared at two levels below its parent cell.",
                                    actionRequest: {
                                        CellProcessor: {
                                            proxy: {
                                                connect: {
                                                    processCoordinates: { apmID: "TQ0j4BIhRQu5SmS-cWxJvQ", instanceName: "secondary-instance" }
                                                },
                                                proxyCoordinates: "#.testNamespace1.testNamespace2"
                                            }
                                        }
                                    },
                                    apmBindingPath: { apmID: "TQ0j4BIhRQu5SmS-cWxJvQ", instanceName: "root-instance" }
                                }
                            },
                            */

                            {
                                actRequest: {
                                    actorName: "Test aRXQIZvdSE2rVnqR0HrfYg",
                                    actorTaskDescription: "Deactivate test cell.",
                                    actionRequest: {
                                        CellProcessor: { process: { deactivate: {}, processCoordinates: { apmID: "TQ0j4BIhRQu5SmS-cWxJvQ", instanceName: "root-instance" } } }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        } // vectorRequest
    } // holodeck test request

];
