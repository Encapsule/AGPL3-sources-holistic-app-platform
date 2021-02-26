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
                    observableValueSpec: {
                        ____accept: "jsObject",
                        ____defaultValue: { ____types: "jsObject", ____label: "Default Specialization" }
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

                    const cellModelLabel = `${templateLabel}<${generatorRequest_.cellModelLabel}>`;

                    const cmSynthResponse = cmtObservableValue.synthesizeCellModel({ cellModelLabel, synthesizeRequest: { valueTypeDescription: `Specialization for ${cellModelLabel}`, valueTypeSpec: generatorRequest_.sythesizeRequest.displayElement.observableValueSpec }});
                    if (cmSynthResponse.error) {
                        errors.push(cmSynthResponse.error);
                        break;
                    }

                    const cmDisplayViewOutputObservableValue = cmSynthResponse.result;

                    const cellMemorySpec = {

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
                                ____appdsl: { apm: cmDisplayViewOutputObservableValue.getCMConfig({ type: "APM" }).result[0].getID() }
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
                                    ____appdsl: { apm: cmObservableValueProxyHelper.getCMConfig({ type: "APM" }).result[0].getID() }
                                }
                            }

                        }

                    };

                    // TODO: will fail in OFSP because we're not setting response.result to valid CellModel declaration yet...


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

