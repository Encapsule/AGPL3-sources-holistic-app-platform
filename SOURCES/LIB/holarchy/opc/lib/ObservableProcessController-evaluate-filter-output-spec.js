
const opcEvaluateResultSpec = {
    ____label: "OPC Evaluation Result",
    ____description: "Descriptor object that models the response result output of the OPC evaluation filter. This information is used to analyze and test the inner workings of an OPC instance.",
    ____types: "jsObject",

    evalFrames: {
        ____label: "OPC Evaluation Frames",
        ____description: "The evaluation frames array is an ordered list of one or more evaluation frames.",
        ____types: "jsArray",

        evalFrame: {
            ____label: "OPC Evaluation Frame",
            ____description: "An evaluation frame comprises some outer summary information. And, a map of OPM instances evaluated during the frame.",
            ____types: "jsObject",

            opmInstanceMap: {
                ____label: "OPM Instance Frames",
                ____description: "The opmInstanceFrameMap maps CDS data paths for bound OPM instance evaluation frame descriptors.",
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
                }

            } // opmInstanceFrameMap

        } // evaluationFrame

    }, // evaluationFrames

    evalStopwatch: {
        ____label: "OPC Evaluation Timing Data",
        ____description: "A descriptor object that models a microsecond-precision time series of labeled evaluation events that allow accurate measurment of all phases of OPC evaluation.",
        ____accept: "jsObject"
        // TODO: Keep going down the tree... This is important which is why we're passing this data through a filter ;-)
    },

    framesEvaluated: {
        ____label: "Frames Evaluated",
        ____description: "A count of the total number of frames evaluated in this evaluation sequence.",
        ____accept: "jsNumber",
        ____defaultValue: 0
    },

    totalEvaluationErrors: {
        ____label: "Evaluation Errors",
        ____description: "A count of the total number of errors encountered during this OPC evaluation.",
        ____accept: "jsNumber",
        ____defaultValue: 0
    },

    totalStepTransitions: {
        ____label: "Step Transitions",
        ____description: "A count of the total number of OPM instance process steps that occurred during this OPC evaluation.",
        ____accept: "jsNumber",
        ____defaultValue: 0
    }

};

module.exports = opcEvaluateResultSpec;

