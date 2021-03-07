// DisplayView_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmtObservableValue = require("../ObservableValue_T");
    const cmObservableValueHelper = require("../ObservableValueHelper");

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

                    const cmSynthRequest = {
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
                                    displayProcessLink: {
                                        ____types: [ "jsUndefined", "jsObject" ],
                                        reactElement: {
                                            ____types: "jsObject",
                                            displayName: { ____accept: "jsString" },
                                            thisRef: { ____accept: "jsObject" },
                                        }
                                    }
                                },

                                inputs: {
                                    ____label: "Observable Input Values",
                                    ____types: "jsObject",
                                    ____defaultValue: {},

                                    displayViews: {
                                        ____label: `${generatorRequest_.cellModelLabel} Sub-Display View Inputs`,
                                        ____types: "jsObject",
                                        ____asMap: true,
                                        ____defaultValue: {},
                                        subviewLabel: {
                                            ____types: "jsObject",
                                            ____appdsl: { apm: cmObservableValueHelper.getCMConfig({ type: "APM" }).result[0].getID() }
                                        }
                                    }

                                }
                            }, // ~.apm.ocdDataSpec
                            steps: {

                                uninitialized: {
                                    description: "Default starting step of activated cell.",
                                    transitions: [ { transitionIf: { always: true }, nextStep: "display-view-initialize" } ]
                                },

                                "display-view-initialize": {
                                    description: "The display view process is initializing itself...",
                                    transitions: [ { transitionIf: { always: true }, nextStep: "display-view-wait-display-process" } ],
                                    actions: { exit: [ { holarchy: { common: { actions: { DisplayViewBase: { _private: { stepWorker: { action: "initialize" } } } } } } } ] }
                                },

                                "display-view-wait-display-process": {
                                    description: "The display view process is waiting for the React.Element that will be generated by @encapsule/d2r2 using our current #.outputs.displayView value to be mounted in the virtual DOM. And, to link back to us via action call.",
                                    transitions: [ { transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.core.displayProcessLink" } } } } } }, nextStep: "display-view-display-process-linked" } ]
                                },

                                "display-view-display-process-linked": {
                                    description: "The display view process has established a bidirectional link w/a mounted React.Element in the virtual DOM.",
                                }

                            } // ~.apm.steps
                        },

                        subcells: [
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

