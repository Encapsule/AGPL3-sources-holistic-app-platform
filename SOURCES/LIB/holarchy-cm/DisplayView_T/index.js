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
                    renderDataPropsSpec: {
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
                            renderDataPropsSpec: generatorRequest_.specializationData.displayElement.renderDataPropsSpec
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
                            }
                        },

                        subcells: [
                            cmDisplayViewOutputObservableValue
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

