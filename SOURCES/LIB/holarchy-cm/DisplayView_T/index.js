// DisplayView_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cmtObservableValue = require("../cmtObservableValue");
    const cmObservableValueProxyHelper = require("../ObservableValueProxy");

    // const cmObservableValueBase = require("./ObservableValueBase");
    // const cmtObservableValueProxyWorker = require("./ObservableValueProxyWorker_T");

    const templateLabel = "DisplayView";

    // const cellLib = require("./lib");


    // const tableDisplayView = cmtDisplayView.synthesizeCellModel({ cellModelLabel: "Table", synthesizeRequest })

    const cmtDisplayView = new holarchy.CellModelTemplate({
        cmasScope: cmasHolarchyCMPackage,
        templateLabel,
        cellModelGenerator: {
            synthesizeMethodRequestSpec: {
                ____label: `${templateName}<X> Specialization Request`,
                ____types: "jsObject",

                description: {
                    ____label: `${templateName}<X> Description`,
                    ____description: `Developer-provided description of the function/purpose of the X member of ${templateName} CellModel family.`,
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
            }
        },
        generatorFilterBodyFunction: function(generatorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const cellModelLabel = `${templateName}<${generatorRequest_.cellModelLabel}>`;

                const cmSynthResponse = cmtObservableValue.synthesizeCellModel({ cellModelLabel, synthesizeRequest: { valueTypeDescription: `Specialization for ${cellModelLabel}`, valueTypeSpec: generatorRequest_.sythesizeRequest.displayElement.observableValueSpec }});
                if (cmSynthResponse.error) {
                    errors.push(cmSynthResponse.error);
                    break;
                }

                const cmDisplayViewOutputObservableValue = cmSynthResponse.result;

                const cellMemorySpec = {

                    ____label: `${templateName}<${generatorRequest_.cellModelLabel}> Cell Memory`,
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
    });

    if (cmtDisplayView.isValid()) {
        throw new Error(cmtDisplayView.toJSON());
    }

    module.exports = cmtDisplayView;

})();

