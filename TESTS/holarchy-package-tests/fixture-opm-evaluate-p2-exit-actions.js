
const holarchy = require("@encapsule/holarchy");

module.exports = [

    new holarchy.ObservableProcessModel({
        id: "Rgt3dz-6Ra-zqpbnpBrJDg",
        name: "OPM Eval P2 Test #1",
        description: "A simple test OPM (force controller action enter error)",
        steps: {
            uninitialized: {
                description: "Default starting process step.",
                transitions: [
                    {
                        transitionIf: {
                            always: true
                        },
                        nextStep: "goal"
                    }
                ],
                actions: {
                    exit: [
                    ]
                }
            },

            goal: {
                description: "Test goal step (never reached)."
            }
        }
    })

];
