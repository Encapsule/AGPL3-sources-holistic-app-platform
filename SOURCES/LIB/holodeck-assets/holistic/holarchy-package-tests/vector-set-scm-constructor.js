
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
                            description: "Try to construct a minimally configured SoftwareCellModel with a mimimally-defined OPM association.",
                            opm: {
                                id: "cJSBP90NTcu1bJMhCOjbQg",
                                name: "Placeholder OPM",
                                description: "A minimally-configured placeholder."
                            }
                        }
                    }
                }
            }
        }
    },

    {
        id: "AE_pEJ7LTdSvohEBZl_Bfw",
        name: "SoftwareCellModel Constructor #3",
        description: "Try to construct a minimally configured SoftwareCellModel with a single TransitionOperator plug-in.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    SoftwareCellModel: {
                        constructorRequest: {
                            id: "AE_pEJ7LTdSvohEBZl_Bfw",
                            name: "SoftwareCellModel Constructor #3",
                            description: "Try to construct a minimally configured SoftwareCellModel with a single TransitionOperator plug-in.",
                            operators: [
                                {
                                    id: "o3Q4YKI_SLOus82xE7Gaag",
                                    name: "Placeholder TOP",
                                    description: "A minimally configured placeholder."
                                }
                            ]
                        }
                    }
                }
            }
        }
    }


];
