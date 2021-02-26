// DisplayView_T/DisplayStreamMessage_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
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

                    const cmID = generatorRequest_.cmtInstance.mapLabels({ CM: generatorRequest_.cellModelLabel }).result.CMID;
                    const apmID = generatorRequest_.cmtInstance.mapLabels({ APM: generatorRequest_.cellModelLabel }).result.APMID;

                    // Create a specialized cell memory spec for our CellModel's APM.

                    const cellMemorySpec = {
                        ____label: `${templateLabel}<${generatorRequest_.cellModelLabel}>`,
                        ____description: generatorRequest_.specializationData.description,
                        ____types: "jsObject",
                        renderContext: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            apmBindingPath: { ____accept: [ "jsUndefined", "jsString" ] }
                        },
                        renderData: {
                            ____label: `${templateLabel}<${generatorRequest_.cellModelLabel}> Render Data Request`,
                            ____types: "jsObject"
                            //// extended below
                        }
                    };
                    // Specialize the renderData spec ...
                    cellMemorySpec.renderData[apmID] = { ...generatorRequest_.specializationData.renderDataPropsSpec };

                    response.result = {
                        id: cmID,
                        name: `${templateLabel}<${generatorRequest_.cellModelLabel}> Model`,
                        description: generatorRequest_.specializationData.description,
                        apm: {
                            id: apmID,
                            name: `${templateLabel}<${generatorRequest_.cellModelLabel}> Process`,
                            description: generatorRequest_.specializationData.description,
                            ocdDataSpec: cellMemorySpec
                        }
                    }

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

