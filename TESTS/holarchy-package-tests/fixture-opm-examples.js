// fixture-opm-examples.js

const holarchy = require("@encapsule/holarchy");

module.exports = [

    new holarchy.ObservableProcessModel({
        id: "_vC2O7DGTZ22R5hvxpy0WQ",
        name: "OPM Test A",
        description: "A simple test OPM (force transition operator error).",
        steps: {
            uninitialized: {
                description: "Default starting process step.",
                transitions: [
                    {
                        transitionIf: {
                            noneSuchOperator: true
                        },
                        nextStep: "goal"
                    }
                ]
            },

            goal: {
                description: "Test goal state (never reached)."
            }
        }
    }),


    new holarchy.ObservableProcessModel({
        id: "SyCUD3kpQ8mtYbV5A_4BPA",
        name: "OPM Test B",
        description: "A simple test OPM",
        steps: {
        }
    }),

    new holarchy.ObservableProcessModel({
        id: "Pkr1EErLSiiHQRt8gCaO0Q",
        name: "OPM Test C",
        description: "A simple test OPM",
        steps: {
        }
    }),

    new holarchy.ObservableProcessModel({
        id: "ZFpRfMRETDqavS3EqEuv1Q",
        name: "OPC Test D",
        description: "A simple test OPM",
        steps: {
        }
    })

];



