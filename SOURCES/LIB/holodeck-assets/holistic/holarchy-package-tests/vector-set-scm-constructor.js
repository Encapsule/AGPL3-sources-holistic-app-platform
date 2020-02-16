
module.exports = [

    {
        id: "VcFs1BSZTLCb8nlIwW3Pmg",
        name: "SoftwareCellModel Constructor #1",
        description: "Default construct holarchy/SoftwareCellModel ES6 class. Should fail.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    SoftwareCellModel: {
                        constructorRequest: undefined // explicitly
                    }
                }
            }
        }
    },

    {
        id: "vzmMGynKTy2uu6W8R-1rvQ",
        name: "SoftewareCellModel Constructor #2",
        description: "Try to construct a minimally configured SoftwareCellModel with a single TransitionOperator plug-in.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    SoftwareCellModel: {
                        constructorRequest: {
                            id: "vzmMGynKTy2uu6W8R-1rvQ",
                            name: "SoftewareCellModel Constructor #2",
                            description: "Try to construct a minimally configured SoftwareCellModel with a single TransitionOperator definition vs plug-in ES6 class instance.",
                            opm: {
                                id: "cJSBP90NTcu1bJMhCOjbQg",
                                name: "Fake Transition Operator #1",
                                description: "A fake transition operator definition.",
                            }
                        }
                    }
                }
            }
        }
    }

];
