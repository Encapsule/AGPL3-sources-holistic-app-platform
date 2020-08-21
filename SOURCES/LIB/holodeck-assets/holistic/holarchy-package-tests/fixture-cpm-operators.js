// fixture-cpm-operators.js

module.exports = { // CellModel declaration
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
                    {
                        transitionIf: {
                            always: true
                        },
                        nextStep: "wait_for_child_processes"
                    }
                ]
            },
            wait_for_child_processes: {
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
                        nextStep: "wait_for_child_processes_all_in_step"
                    }
                ]
            },
            wait_for_child_processes_all_in_step: {
                description: "Wait for all child processes to reach goal step.",
                transitions: [
                    {
                        transitionIf: {
                            holarchy: {
                                CellProcessor: {
                                    childProcessesAllInStep: {
                                        apmStep: "NEVER_HAPPENS"
                                    }
                                }
                            }
                        },
                        nextStep: "has_child_processes_wait_descendant_processes"
                    }
                ]
            },
            has_child_processes_wait_descendant_processes: {
                description: "The test cell process has one or more children cell processes.",
                transitions: [
                    {
                        transitionIf: {
                            holarchy: {
                                CellProcessor: {
                                    descendantProcessesActive: {}
                                }
                            }
                        },
                        nextStep: "has_descendant_processes"
                    }
                ]
            },
            has_descendant_processes: {
                description: "The test cell process has at least one child cell process that has one or more children.",
            }
        }
    }
};

