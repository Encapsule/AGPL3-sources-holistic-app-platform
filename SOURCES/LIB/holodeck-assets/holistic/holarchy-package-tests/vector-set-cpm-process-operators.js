// vector-set-cpm-process-operators.js

module.exports = [

    {
        id: "DhIrP3aDRQGrnmV63573iA",
        name: "CPM Child Processes Active Test",
        description: "Tests the CPM child processes active transition operator implementation.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "DhIrP3aDRQGrnmV63573iA",
                            name: "CPM Child Processes Active Test",
                            description: "Tests the CPM child processes active transition operator implementation.",
                            cellmodel: {
                                id: "1jSxHMrqS6i9eDiRvDmfeg",
                                name: "CPM Child Process Active Operator Test Model",
                                description: "Test model",
                                apm: {
                                    id: "LVjhjYUcQXOYcbI_xbepJQ",
                                    name: "CPM Child Process Active Operator Test Process",
                                    description: "Test process",
                                    steps: {
                                        uninitialized: {
                                            description: "Default step",
                                            transitions: [
                                                { transitionIf: { always: true }, nextStep: "wait" }
                                            ]
                                        },
                                        wait: {
                                            description: "Wait for an active child process.",
                                            transitions: [
                                                {
                                                    transitionIf: {
                                                        holarchy: {
                                                            CellProcessor: {
                                                                childProcessesActive: {}
                                                            }
                                                        }
                                                    },
                                                    nextStep: "test_goal"
                                                }
                                            ]
                                        },
                                        test_goal: {
                                            description: "The test passes if we reach this step."
                                        }
                                    }
                                }
                            }
                        },
                        actRequests: [
                            {
                                actorName: "CPM Child Processes Active Test",
                                actorTaskDescription: "Start the first process instance. We will use this process as our test.",
                                actionRequest: {
                                    holarchy: {
                                        CellProcessor: {
                                            process: {
                                                create: {
                                                    apmID: "LVjhjYUcQXOYcbI_xbepJQ",
                                                    cellProcessUniqueName: "Test Process A"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                actorName: "CPM Child Processes Active Test",
                                actorTaskDescription: "Start the second process instance. We will use this process to trigger a process step change in the first test process instance.",
                                actionRequest: {
                                    holarchy: {
                                        CellProcessor: {
                                            process: {
                                                create: {
                                                    // Optionally override the default parent process specification.
                                                    parentCellProcess: {
                                                        cellProcessNamespace: {
                                                            apmID: "LVjhjYUcQXOYcbI_xbepJQ",
                                                            cellProcessUniqueName: "Test Process A"
                                                        }
                                                    },
                                                    apmID: "LVjhjYUcQXOYcbI_xbepJQ",
                                                    cellProcessUniqueName: "Test Process B",
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }

];

