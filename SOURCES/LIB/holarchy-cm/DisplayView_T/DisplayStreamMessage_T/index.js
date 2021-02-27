// DisplayView_T/DisplayStreamMessage_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");

    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmtObservableValue = require("../../ObservableValue_T");

    const templateLabel = "DisplayStreamMessage";

    const cmtDisplayStreamMessage = new holarchy.CellModelTemplate({

        cmasScope: cmasHolarchyCMPackage,
        templateLabel,

        cellModelGenerator: {

            specializationDataSpec: {
                ____types: "jsObject",
                description: { ____accept: "jsString" },
                renderDataPropsSpec: {
                    ____accept: "jsObject",
                    ____defaultValue: { ____types: "jsObject", ____appdsl: { missingRenderDataPropsSpec: true } }
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

                    const displayStreamMessageLabel = `${templateLabel}<${generatorRequest_.cellModelLabel}>`;

                    const apmID = generatorRequest_.cmtInstance.mapLabels({ APM: generatorRequest_.cellModelLabel }).result.APMID;

                    // Set the invariant portions of all DisplayStreamMessage family members.

                    const displayStreamMessageSpec = {
                        ____label: displayStreamMessageLabel,
                        ____description: generatorRequest_.specializationData.description,
                        ____types: "jsObject",
                        renderContext: {
                            ____label: `${displayStreamMessageLabel} Render Context`,
                            ____types: "jsObject",
                            ____defaultValue: {},
                            apmBindingPath: { ____accept: [ "jsUndefined", "jsString" ] }
                        },
                        renderData: {
                            ____label: `${displayStreamMessageLabel} Render Data`,
                            ____types: "jsObject"
                            //// extended below
                        }
                    };

                    // Customize the displayStreamMessageSpec by extending its renderData spec w/instance specialization data.

                    displayStreamMessageSpec.renderData[apmID] = { ...generatorRequest_.specializationData.renderDataPropsSpec };

                    let synthResponse = cmtObservableValue.synthesizeCellModel({
                        cellModelLabel: displayStreamMessageLabel,
                        specializationData: {
                            valueTypeDescription: `An ObservableValue<${displayStreamMessageLabel}<${generatorRequest_.cellModelLabel}>> CellModel.`,
                            valueTypeSpec: displayStreamMessageSpec
                        }
                    });
                    if (synthResponse.error) {
                        errors.push(synthResponse.error);
                        break;
                    }

                    const ovCellModel = synthResponse.result;

                    ovCellModel.id = generatorRequest_.cmtInstance.mapLabels({ CM: generatorRequest_.cellModelLabel }).result.CMID;
                    ovCellModel.apm.id = generatorRequest_.cmtInstance.mapLabels({ APM: generatorRequest_.cellModelLabel }).result.APMID;

                    response.result = ovCellModel;

                    break;
                }
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            }
        }

    });

    if (!cmtDisplayStreamMessage.isValid()) {
        throw new Error(cmtDisplayStreamMessage.toJSON());
    }

    module.exports = cmtDisplayStreamMessage;

})();

