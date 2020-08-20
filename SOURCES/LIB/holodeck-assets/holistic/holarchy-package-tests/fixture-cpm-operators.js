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
};

