// DisplayView_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmtObservableValue = require("../ObservableValue_T");
    const cmObservableValueHelper = require("../ObservableValueHelper");
    const cmObservableValueHelperMap = require("../ObservableValueHelperMap");

    const cmtDisplayStreamMessage = require("./DisplayStreamMessage_T");

    const templateLabel = "DisplayView";

    const cmtDisplayView = new holarchy.CellModelTemplate({
        cmasScope: cmasHolarchyCMPackage,
        templateLabel,
        cellModelGenerator: {

            specializationDataSpec: {
                 ____label: `${templateLabel}<X> Specialization Data`,
                ____types: "jsObject",

                description: {
                    ____label: `${templateLabel}<X> Description`,
                    ____description: `Developer-provided description of the function/purpose of the X member of ${templateLabel} CellModel family.`,
                    ____accept: "jsString"
                },

                displayElement: {
                    ____label: "Display Element Specializations",
                    ____types: "jsObject",
                    ____defaultValue: {},
                    displayLayoutSpec: {
                        ____accept: "jsObject",
                    }
                }
            },

            /*
              generatorRequest = {
              cmtInstance, // reference to this CellModelTemplate template instance --- aka the DisplayView CellModel synthesizer.
              cellModelLabel, // passed by cmtInstance.synthesizeCellModel from caller
              specializationData // passed by cmtInstance.synthesizeCellModel from caller filtered per above spec
              }
            */
            generatorFilterBodyFunction: function(generatorRequest_) {
                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    // TODO: CLEAN THIS UP... We are getting away w/this here only because ? Actually, I think this maybe should be failing but is somehow not still? In any case, we're getting a unique IRUT and this particular cell is an implementation detail of DisplayView_T.
                    const cmSynthRequest = {
                        cmasScope: generatorRequest_.cmtInstance, // ? ***** TODO***** THIS WILL NEED TO CHANGE --- TEMPLATES WILL NO LONGER EXTENDED CMAS --- TO BE CLEAR SYNTH REQUEST NOW REQUIRES CMAS INPUT AND GENERATOR NEVER USES CMT TO RESOLVE CMAS
                        cellModelLabel: `${templateLabel}<${generatorRequest_.cellModelLabel}>`,
                        specializationData: {
                            description: `Specialization for ${generatorRequest_.cellModelLabel}`,
                            displayViewCellModelLabel: generatorRequest_.cellModelLabel,
                            displayLayoutSpec: generatorRequest_.specializationData.displayElement.displayLayoutSpec
                        }
                    };

                    const cmSynthResponse = cmtDisplayStreamMessage.synthesizeCellModel(cmSynthRequest);
                    if (cmSynthResponse.error) {
                        errors.push("While attempting to synthesize a DisplayStreamMessage family CellModel:");
                        errors.push(cmSynthResponse.error);
                        break;
                    }

                    const cmDisplayViewOutputObservableValue = cmSynthResponse.result;

                    response.result = {
                        id: generatorRequest_.cmtInstance.mapLabels({ CM: generatorRequest_.cellModelLabel }).result.CMID,
                        name: `${templateLabel}<${generatorRequest_.cellModelLabel}> Model`,
                        description: generatorRequest_.specializationData.description,
                        apm: {
                            id: generatorRequest_.cmtInstance.mapLabels({ APM: generatorRequest_.cellModelLabel }).result.APMID,
                            name: `${templateLabel}<${generatorRequest_.cellModelLabel}> Process`,
                            description: generatorRequest_.specializationData.description,
                            ocdDataSpec: {

                                ____label: `${templateLabel}<${generatorRequest_.cellModelLabel}> Cell Memory`,
                                ____types: "jsObject",
                                ____defaultValue: {},

                                outputs: {
                                    ____label: "Observable Output Values",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    displayView: {
                                        ____label: `${generatorRequest_.cellModelLabel} Display View Output`,
                                        ____types: "jsObject",
                                        ____appdsl: { apm: cmDisplayViewOutputObservableValue.apm.id }
                                    }

                                },

                                core: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    viewDisplayProcess: {
                                        // TODO: Revisit the serialization of non-serializable information from OCD memory when a CellProcessor instance is serialized.
                                        toJSON: { ____accept: "jsFunction", ____defaultValue: function() { return { displayName: this.displayName, displayPath: this.displayPath, thisRef: "****React.Element NOT SERIALIZABLE****" }; } },
                                        ____types: [ "jsUndefined", "jsObject" ],
                                        displayName: { ____accept: "jsString" },
                                        displayInstance: { ____accept: "jsString" },
                                        displayPath: { ____accept: "jsString" },
                                        thisRef: { ____accept: "jsObject" },
                                    },
                                    dynamicViewDisplayQueue: {
                                        ____types: "jsArray",
                                        ____defaultValue: [],
                                        reactElementDescriptor: {
                                            ____accept: "jsObject"
                                        }
                                    },
                                    pendingViewDisplayQueue: {
                                        ____types: "jsArray",
                                        ____defaultValue: [],
                                        reactElementDescriptor: {
                                            ____accept: "jsObject"
                                        }
                                    }
                                },

                                inputs: {
                                    ____label: "Observable Input Values",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    //
                                    /* NOTES TO SELF IN CODE
                                    displayViews: {
                                        ____label: `${generatorRequest_.cellModelLabel} Sub-Display View Inputs`,
                                        ____types: "jsObject",
                                        ____asMap: true,
                                        ____defaultValue: {},
                                        subviewLabel: {
                                            ____types: "jsObject",
                                            ____appdsl: { apm: cmObservableValueHelper.getAPM().getID() }
                                        }
                                    },
                                    */
                                    //

                                    // v--- FOR REAL BASED ON ObservableValueHelperMap CellModel

                                    subDisplayViews: {
                                        ____types: "jsObject",
                                        ____defaultValue: {},
                                        ____appdsl: { apm: cmasHolarchyCMPackage.mapLabels({ APM: "ObservableValueHelperMap" }).result.APMID }
                                    }

                                }
                            }, // ~.apm.ocdDataSpec
                            steps: {

                                uninitialized: {
                                    description: "Default starting step of activated cell.",
                                    transitions: [ { transitionIf: { always: true }, nextStep: "display-view-initialize" } ]
                                },

                                "display-view-initialize": {
                                    description: "Cell will perform its process initialization epilogue action(s) on exit from this step...",
                                    transitions: [ { transitionIf: { always: true }, nextStep: "display-view-wait-view-display" } ],
                                    actions: { exit: [ { holarchy: { common: { actions: { DisplayViewBase: { _private: { stepWorker: { action: "initialize" } } } } } } } ] }
                                },

                                "display-view-wait-view-display": {
                                    description: "The display view process is waiting for the React.Element that will be generated by @encapsule/d2r2 using our current #.outputs.displayView value to be mounted in the virtual DOM. And, to link back to us via action call.",
                                    transitions: [
                                        // Evaluates to Boolean true only after the ViewDisplay process (a mounted React.Element) that was "rendered" to the React VDOM via d2r2 <ComponentRouter/> has received its DisplayViewProcess::onComponentDidMount callback and responded by calling DisplayViewBase::linkDisplayProcess
                                        { transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.core.viewDisplayProcess" } } } } } }, nextStep: "display-view-display-process-linked" }
                                    ]
                                },

                                "display-view-display-process-linked": {
                                    description: "The DisplayView family cell has established a bidirectional IPC link its matching ViewDisplay family React.Element (a process that follows it's own rules and evaluates inside React virtual DOM (VDOM).",
                                    transitions: [
                                        // If this DisplayView cell's corresponding ViewDisplay process performed injected unlinked sub-DisplayView into the VDOM,
                                        // then those DisplayView process(es) will have received ViewDisplayProcess.onComponentDidMount and responded by queueing
                                        // their desired link coordinates for us to broker/resolve on their behalf.
                                        {
                                            transitionIf: { holarchy: { cm: { operators: { ocd: { arrayIsEmpty: { path: "#.core.dynamicViewDisplayQueue" } } } } } },
                                            // nextStep: "display-view-quiescent"
                                            nextStep: "display-view-wait-sub-display-view-observers-linked"
                                        },
                                        {
                                            transitionIf: { always: true },
                                            nextStep: "display-view-link-unlinked-view-displays"
                                        }
                                    ]
                                },

                                "display-view-wait-sub-display-view-observers-linked": {
                                    description: "Wait for all ObservableValueHelper entries in our ObservableValueHelperMap to reach their linked process step.",
                                    transitions: [
                                        {
                                            transitionIf: { holarchy: { common: { operators: { ObservableValueHelperMap: { mapIsLinked: { path: "#.inputs.subDisplayViews" } } } } } },
                                            nextStep: "display-view-sub-display-observers-linked"
                                        }
                                    ]
                                },

                                "display-view-sub-display-observers-linked": {
                                    description: "Doubt I will end up keeping this.",
                                    transitions: [
                                        { transitionIf: { always: true }, nextStep: "display-view-quiescent" }
                                    ]
                                },

                                "display-view-quiescent": {
                                    description: "The display view process is linked to its matching view display process and is in its quiescient process step waiting for something to change."
                                },


                                "display-view-link-unlinked-view-displays": {
                                    description: "The DisplayView family cell is resolving IPC link requests from unlinked ViewDisplay processes that were mounted in the last display process update.",
                                    transitions: [
                                        {
                                            transitionIf: { always: true },
                                            nextStep: "display-view-display-process-linked" // Go back and ensure we've taken care of all the unlinked display views. And, then transition to quiescent step (typical).
                                        }
                                    ],
                                    actions: {
                                        exit: [
                                            { holarchy: { common: { actions: { DisplayViewBase: { _private: { stepWorker: { action: "link-unlinked-view-displays" } } } } } } }
                                        ]
                                    }
                                }




                            } // ~.apm.steps
                        },

                        subcells: [
                            cmObservableValueHelper,
                            cmObservableValueHelperMap,
                            cmDisplayViewOutputObservableValue,
                            require("./DisplayViewBase")
                        ]
                    };

                    break;
                }
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            }
        }
    });

    if (!cmtDisplayView.isValid()) {
        throw new Error(cmtDisplayView.toJSON());
    }

    module.exports = cmtDisplayView;

})();

