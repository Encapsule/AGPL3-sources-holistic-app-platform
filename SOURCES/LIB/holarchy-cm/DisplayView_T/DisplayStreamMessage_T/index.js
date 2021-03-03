// DisplayView_T/DisplayStreamMessage_T/index.js

(function() {

    const arccore = require("@encapsule/arccore");
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
                renderDataSpec: {
                    ____accept: "jsObject",
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

                    const apmID = generatorRequest_.cmtInstance.mapLabels({ APM: displayStreamMessageLabel }).result.APMID;

                    // Set the invariant portions of all DisplayStreamMessage family members.

                    const displayStreamMessageSpec = {
                        ____label: displayStreamMessageLabel,
                        ____description: generatorRequest_.specializationData.description,
                        ____types: "jsObject",
                        ____defaultValue: {},
                        renderContext: {
                            ____label: `${displayStreamMessageLabel} Render Context`,
                            ____types: "jsObject",
                            ____defaultValue: {},
                            apmBindingPath: { ____accept: "jsString" } // make required for now?
                        },
                        renderData: {
                            ____label: `${displayStreamMessageLabel} Render Data`,
                            ____types: "jsObject",
                            ____defaultValue: {}
                            //// extended below
                        }
                    };
                    // Customize the displayStreamMessageSpec by extending its renderData spec w/instance specialization data.
                    displayStreamMessageSpec.renderData[apmID] = { ...generatorRequest_.specializationData.renderDataSpec }; // We force this to be friendly to generic call w/no request data that we perform during cell activation.

                    let filterResponse = arccore.filter.create({
                        operationID: "65rI4JXWT02HOmPh1_Eamg",
                        operationName: "renderDataSpec MUST ACCEPT NO INPUT w/OUT ERROR",
                        operationDescription: "A filter that uses your renderDataSpec as inputFilterSpec to determine if it's a valid filter spec and if it can be called generically if used as inputFilterSpec.",
                        inputFilterSpec: generatorRequest_.specializationData.renderDataSpec
                    });
                    if (filterResponse.error) {
                        errors.push(`Unable to generate ${displayStreamMessageLabel} CellModel because the specified renderDataSpec is not a valid filter spec object.`);
                        errors.push(filterResponse.error);
                        break;
                    }
                    filterResponse = filterResponse.result.request();
                    if (filterResponse.error) {
                        errors.push(`Unable to generate ${displayStreamMessageLabel} CellModel because the specified renderDataSpec is not valid. If we use your renderDataSpec as inputFilterSpec and call our testFilter.request() w/no request input there must be no response.error but instead:`);
                        errors.push(filterResponse.error);
                        break;
                    }

                    let synthResponse = cmtObservableValue.synthesizeCellModel({
                        cmasScope: generatorRequest_.cmtInstance,
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

                    let x = generatorRequest_.cmtInstance.mapLabels({ CM: generatorRequest_.cellModelLabel }).result.CMID;
                    let y = generatorRequest_.cmtInstance.mapLabels({ APM: generatorRequest_.cellModelLabel }).result.APMID;

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

