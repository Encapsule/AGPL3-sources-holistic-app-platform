
const opcEvalResultSpec = {
    ____label: "OPC Evaluation Result",
    ____description: "Descriptor object that models the response result output of the OPC evaluation filter. This information is used to analyze and test the inner workings of an OPC instance.",
    ____types: "jsObject",

    evalNumber: {
        ____label: "OPC Evaluation Number",
        ____description: "Monotonically increasing count of evaluations since this OPC class instance was constructed.",
        ____accept: "jsNumber",
        ____defaultValue: 0
    },

    evalFrames: {
        ____label: "OPC Evaluation Frames",
        ____description: "The evaluation frames array is an ordered list of one or more evaluation frames.",
        ____types: "jsArray",

        evalFrame: {
            ____label: "OPC Evaluation Frame",
            ____description: "An evaluation frame comprises some outer summary information. And, a map of OPM instances evaluated during the frame.",
            ____types: "jsObject",

            bindings: {
                ____label: "OPM Instance Binding Map",
                ____description: "A map that relates the CDS pathnames to bound OPM instances evaluated during this frame.",
                ____types: "jsObject",
                ____asMap: true,

                // This is the filter-style dot-delimited absolute path to the OPM instance's backing data in the CDS.
                cdsDataPath: {
                    ____label: "OPM Instance Frame",
                    ____description: "A descriptor object that models the output of the OPM instance frame.",
                    ____types: "jsObject",

                    evaluationContext: {
                        ____label: "OPM Instance Evaluation Context",
                        ____description: "A descriptor object that models the input to the OPM instance evaluation algorithm.",
                        ____types: "jsObject"

                        // TODO: Keep going down the tree... This is important which is why we're passing this data through a filter ;-)
                    },

                    evaluationResponse: {
                        ____label: "OPM Instance Evaluation Response",
                        ____description: "A descriptor object that models the detailed output of the OPM instance evaluation frame algorithm suitable for use in development tools.",
                        ____accept: "jsObject"
                        // TODO: Keep going down the tree... This is important which is why we're passing this data through a filter ;-)
                    }

                } // cdsDataPath

            }, // bindings

            summary: {
                ____types: "jsObject",
                ____defaultValue: {},

                bindingCount: {
                    ____label: "Frame Binding Count",
                    ____description: "The number of OPM model instances discovered during the evaluation for this frame.",
                    ____accept: "jsNumber",
                    ____defaultValue: 0
                },

                transitionCount: {
                    ____label: "Frame Transition Count",
                    ____description: "The number of bound OPM instances that transitioned from one process step to another during the evaluation of this frame.",
                    ____accept: "jsNumber",
                    ____defaultValue: 0
                },

                errorCount: {
                    ____label: "Frame Error Count",
                    ____description: "The number of errors that occurred during the evaluation of this frame.",
                    ____accept: "jsNumber",
                    ____defaultValue: 0
                },

                failures: {
                    ____types: "jsObject",
                    ____asMap: true,
                    ____defaultValue: {},

                    cdsDataPath: {
                        ____types: "jsObject",

                        opm: {
                            ____accept: "jsString",
                        }, // opm

                        step: {
                            ____types: "jsObject",

                            initial: {
                                ____accept: "jsString"
                            },

                            final: {
                                ____accept: "jsString"
                            }
                        } // step
                    } // failureSummaryDescriptor
                }, // failures

                transitions: {
                    ____types: "jsObject",
                    ____asMap: true,
                    ____defaultValue: {},

                    cdsDataPath: {
                        ____types: "jsObject",

                        opm: {
                            ____accept: "jsString"
                        }, // opm

                        step: {
                            ____types: "jsObject",

                            initial: {
                                ____accept: "jsString"
                            }, // initial

                            final: {
                                ____accept: "jsString"
                            } // final
                        } // step

                    } // transitionSummaryDescriptor

                } // transitions

            } // summary

        } // evalFrame

    }, // evaluationFrames

    summary: {
        ____label: "OPC Evaluation Summary",
        ____description: "A descriptor object containing OPC evaluation summary metrics.",
        ____types: "jsObject",
        ____defaultValue: {},

        evalStopwatch: {
            ____label: "OPC Evaluation Timing Data",
            ____description: "A descriptor object that models a microsecond-precision time series of labeled evaluation events that allow accurate measurment of all phases of OPC evaluation.",
            ____accept: "jsObject"
            // TODO: Keep going down the tree... This is important which is why we're passing this data through a filter ;-)
        },

        framesCount: {
            ____label: "Frames Evaluated",
            ____description: "A count of the total number of frames sequenced during this OPC evaluation.",
            ____accept: "jsNumber",
            ____defaultValue: 0
        },

        errorCount: {
            ____label: "OPC Evaluation Error Count",
            ____description: "A count of the total number of errors encountered during this OPC evaluation.",
            ____accept: "jsNumber",
            ____defaultValue: 0
        },

        transitionCount: {
            ____label: "OPM Instance Step Transition Count",
            ____description: "A count of the total number of OPM instance process step transitions that occurred during this OPC evaluation.",
            ____accept: "jsNumber",
            ____defaultValue: 0
        }

    } // summary

}; // opcEvalResultSpec

module.exports = opcEvalResultSpec;

