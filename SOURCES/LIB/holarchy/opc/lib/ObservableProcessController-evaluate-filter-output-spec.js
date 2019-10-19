

const opcEvalResultSpec = {
    ____label: "OPC Evaluation Result",
    ____description: "Descriptor object that models the response result output of the OPC evaluation filter. This information is used to analyze and test the inner workings of an OPC instance.",
    ____types: "jsObject",

    evalNumber: {
        ____label: "OPC Evaluation Number",
        ____description: "Monotonically increasing count of evaluations since this OPC class instance was constructed.",
        ____accept: "jsNumber"
    },

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

        frameCount: {
            ____label: "Frames Evaluated",
            ____description: "A count of the total number of frames sequenced during this OPC evaluation.",
            ____accept: "jsNumber"
        },

        errorCount: {
            ____label: "OPC Evaluation Error Count",
            ____description: "A count of the total number of errors encountered during this OPC evaluation.",
            ____accept: "jsNumber"
        },

        transitionCount: {
            ____label: "OPM Instance Step Transition Count",
            ____description: "A count of the total number of OPM instance process step transitions that occurred during this OPC evaluation.",
            ____accept: "jsNumber"
        }

    }, // summary

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
                cdsDataPathIRUT: {
                    ____label: "OPM Instance Frame",
                    ____description: "A descriptor object that models the output of the OPM instance frame.",
                    ____types: "jsObject",

                    evalRequest: {
                        ____label: "OPM Instance Evaluation Context",
                        ____description: "A descriptor object that models the input to the OPM instance evaluation algorithm.",
                        ____types: "jsObject",

                        dataBinding: {
                            ____label: "OPM Instance Binding",
                            ____description: "A descriptor object that models that information required to evaluate the OPM instance against it's binding namespace in the CDS.",
                            ____types: "jsObject",

                            dataPath: {
                                ____label: "Data Binding Path",
                                ____description: "A filter-style dot-delimited namespace path URI referencing this OPM instance's shared data object in the CDS.",
                                ____accept: "jsString"
                            },

                            dataRef: {
                                ____label: "Data Binding Reference",
                                ____description: "A reference to the CDS data namespace bound to this OPM instance (always a descriptor object).",
                                ____accept: "jsObject" // This will always be an object because OPM instances may only be bound to objects used has descriptors (as opposed to a dictionary/map/associative array)
                            },

                            specPath: {
                                ____label: "Data Binding Spec Path",
                                ____description: "A filter-style dot-delimited namespace path URI referencing the filter spec namespace descriptor associated with dataPath.",
                                ____accept: "jsString"
                            },

                            specRef: {
                                ____label: "Data Binding Spec Reference",
                                ____description: "A reference to the filter spec namespace descriptor associated with dataRef.",
                                ____accept: "jsObject" // This will always be an object because filter specs are always objects.
                            }
                        },

                        initialStep: {
                            ____label: "Initial Step",
                            ____description: "The initial process step this OPM instance was found to be in at the beginning of the evaluation frame.",
                            ____accept: "jsString"
                        },

                        opmRef: {
                            ____label: "OPM Reference",
                            ____description: "A reference to the ObservableProcessModel instance bound to this data namespace in the CDS.",
                            ____accept: "jsObject"
                        }
                    },

                    evalResponse: {
                        ____label: "OPM Instance Evaluation Response",
                        ____description: "A descriptor object that models the detailed output of the OPM instance evaluation frame algorithm suitable for use in development tools.",
                        ____types: "jsObject",

                        status: {
                            ____label: "OPM Frame Status",
                            ____description: "A string enumeration similar to a process step name indicating the status of this specific OPM instance evaluation in the context of this evaluation frame.",
                            ____accept: "jsString",
                            ____inValueSet: [ "pending", "evaluating", "transitioning", "transitioning-dispatch-exit-actions", "transitioning-dispatch-enter-actions", "noop", "transitioned", "error" ]

                        }, // status

                        finishStep: {
                            ____label: "Finish Step",
                            ____description: "The final process step this OPM instance was left in at the end of the evaluation frame.",
                            ____accept: "jsString"

                        }, // finishStep

                        actions: {
                            ____types: "jsObject",

                            p1: { // OPM step transition operator request message dispatch response sequence
                                ____types: "jsArray",
                                evalDescriptor: {
                                    ____accept: "jsObject"
                                    // TODO complete this
                                }
                            }, // p1

                            p2: { // OPM step exit action request message dispatch response sequence
                                ____types: "jsArray",
                                evalDescriptor: {
                                    ____accept: "jsObject"
                                    // TODO complete this
                                }
                            }, // p2

                            p3: { // OPM step enter action request message dispatch response sequence
                                ____types: "jsArray",
                            }, // p3

                            p4: { // OPM step transition finalize response
                                ____accept: [ "jsObject", "jsNull" ],
                                // TODO: Finish this filter response spec
                            } // p4

                        },

                        errors: {
                            ____types: "jsObject",
                            ____defaultValue: {},

                            p0: { // binding
                                ____types: "jsNumber",
                            },

                            p1: { // operator dispatch
                                ____types: "jsNumber",
                            },

                            p2: { // exit action dispatch
                                ____types: "jsNumber",
                            },

                            p3: { // enter action dispatch
                                ____types: "jsNumber",
                            },

                            p4: { // finalize
                                ____types: "jsNumber",
                            },

                            total: { // total
                                ____types: "jsNumber",
                            }

                        } // errors

                    } // evaluationResponse

                } // cdsDataPathIRUT

            }, // bindings

            summary: {
                ____types: "jsObject",

                bindingCount: {
                    ____label: "Frame Binding Count",
                    ____description: "The number of OPM model instances discovered during the evaluation for this frame.",
                    ____accept: "jsNumber"
                },

                transitionCount: {
                    ____label: "Frame Transition Count",
                    ____description: "The number of bound OPM instances that transitioned from one process step to another during the evaluation of this frame.",
                    ____accept: "jsNumber"
                },

                errorCount: {
                    ____label: "Frame Error Count",
                    ____description: "The number of errors that occurred during the evaluation of this frame.",
                    ____accept: "jsNumber"
                },

                failures: {
                    ____types: "jsObject",
                    ____asMap: true,

                    cdsDataPathIRUT: {
                        ____types: "jsObject",

                        opm: {
                            ____accept: "jsString",
                        }, // opm

                        step: {
                            ____types: "jsObject",

                            initial: {
                                ____accept: "jsString"
                            },

                            finish: {
                                ____accept: "jsString"
                            }
                        } // step
                    } // failureSummaryDescriptor
                }, // failures

                transitions: {
                    ____types: "jsObject",
                    ____asMap: true,
                    ____defaultValue: {},

                    cdsDataPathHash: {
                        ____types: "jsObject",

                        opm: {
                            ____accept: "jsString"
                        }, // opm

                        step: {
                            ____types: "jsObject",

                            initial: {
                                ____accept: "jsString"
                            }, // initial

                            fininsh: {
                                ____accept: "jsString"
                            } // final
                        } // step

                    } // transitionSummaryDescriptor

                } // transitions

            } // summary

        } // evalFrame

    } // evaluationFrames

}; // opcEvalResultSpec

module.exports = opcEvalResultSpec;

