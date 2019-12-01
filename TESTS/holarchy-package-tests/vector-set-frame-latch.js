
const holarchy = require("@encapsule/holarchy");
const sml = require("@encapsule/holarchy-sml");

const opmFrameLatchDeclaration = {
    id: "z_mTe02hSWmaM1iRO1pBeA",
    name: "Observable Frame Latch",
    description: "Observable frame latch model buffers a value in an OPM-bound namespace for one evaluation frame.",
    opmDataSpec: {
        ____label: "Observable Frame Latch",
        ____types: "jsObject",
        ____defaultValue: {},
        value: {
            ____opaque: true
        },
        clock: {
            ____accept: "jsBoolean",
            ____defaultValue: false
        }
    },
    steps: {
        uninitialized: {
            description: "Default starting process step.",
            transitions: [
                {
                    nextStep: "updated",
                    transitionIf: { always: true }
                }
            ],
            actions: {
                exit: [
                    { holarchy: { sml: { action: { ocd: { setBooleanFlag: { path: "#.clock" } } } } } }
                ]
            }
        },
        updated: {
            description: "The value managed by the frame latch has been written.",
            transitions: [
                {
                    nextStep: "waiting",
                    transitionIf: { always: true }
                }
            ],
            actions: {
                exit: [
                    { holarchy: { sml: { action: { ocd: { clearBooleanFlag: { path: "#.clock" } } } } } }
                ]
            }
        },
        waiting: {
            description: "The frame latch is waiting for value to be written.",
            transitions: [
                {
                    nextStep: "updated",
                    transitionIf: { holarchy: { sml: { operator: { isBooleanFlagSet: { path: "#.clock" } } } } }
                }
            ]

        }
    }
};




// @encapsule/holodeck test vector set:
module.exports = [

    {
        id: "sO15Cox_SVqcCgyrOllAwQ",
        name: "Frame Latch OPM Test #1",
        description: "Run our Observable Frame Latch OPM declaration through the OPM test harness.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessModel: {
                        constructorRequest: opmFrameLatchDeclaration
                    }
                }
            }
        }
    },


    {
        id: "uZN6-qpIQO6CkwmLDWtMCw",
        name: "OPC Frame Latch Test #1",
        description: "Try to apply the Frame Latch OPM in an OPC system.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "uZN6-qpIQO6CkwmLDWtMCw",
                            name: "OPC Frame Latch Test #1",
                            description: "Try to apply the Frame Latch OPM in an OPC system.",
                            observableProcessModelSets: [
                                [
                                    new holarchy.ObservableProcessModel(opmFrameLatchDeclaration)
                                ]
                            ],
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                frameLatch: {
                                    ____types: "jsObject",
                                    ____appdsl: { opm: "z_mTe02hSWmaM1iRO1pBeA" },
                                    value: {
                                        ____accept: "jsString"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


];
