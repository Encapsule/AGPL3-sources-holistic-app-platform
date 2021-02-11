// ObservableValue_T/index.js

(function() {

    const CellModelTemplate = require("../CellModelTemplate");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmtObservableValueProxyWorker = require("./ObservableValueProxyWorker_T");

    const templateLabel = "ObservableValue";

    const cellLib = require("./celllib");

    const cmtObservableValue = new CellModelTemplate({
        cmasScope: cmasHolarchyCMPackage,
        templateLabel,
        cellModelGenerator: {
            synthesizeMethodRequestSpec: {
                ____label: `${templateLabel}<X> Specialization Request`,
                ____types: "jsObject",
                valueTypeDescription: { ____accept: "jsString" },
                valueTypeSpec: {
                    ____label: "Value Data Specification",
                    ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                    ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
                }
            },
            generatorFilterBodyFunction: function(request_) {
                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    // First, synthesize a specialized ObservableValueProxyWorker CellModel specialization.
                    let synthesizeResponse = cmtObservableValueProxyWorker.synthesizeCellModel(request_); // Same request signature w/different CellModel generator.
                    if (synthesizeResponse.error) {
                        errors.push(synthesizeResponse.error);
                        break;
                    }

                    const observableValueProxyWorkerCellModel = synthesizeResponse.result;

                    // Now synthesize the requested ObservableValue specialization.

                    const cellMemorySpec = {
                        ____types: "jsObject",
                        ____defaultValue: {},
                        value: { ...request_.synthesizeRequest.valueTypeSpec },
                        revision: { ____types: "jsNumber", ____defaultValue: -1 },
                    };

                    response.result = {

                        id: request_.cmtInstance.mapLabels({ CM: request_.cellModelLabel }).result.CMID,
                        name: `${templateLabel}<${request_.cellModelLabel}>`,
                        description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,

                        apm: {

                            id: request_.cmtInstance.mapLabels({ APM: request_.cellModelLabel }).result.APMID,
                            name: `${templateLabel}<${request_.cellModelLabel}>`,
                            description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,

                            ocdDataSpec: cellMemorySpec,

                            steps: {

                                "uninitialized": {
                                    description: "Default starting process step.",
                                    transitions: [
                                        { transitionIf: { always: true }, nextStep: "observable-value-initialize" }
                                    ]
                                },

                                "observable-value-initialize": {
                                    description: "ObservableValue is initializing.",
                                    transitions: [
                                        {
                                            transitionIf: { holarchy: { cm: { operators: { ocd: { compare: { values: { a: { value: -1 }, operator: "<", b: { path: "#.revision" } } } } } } } },
                                            nextStep: "observable-value-ready"
                                        },
                                        { transitionIf: { always: true }, nextStep: "observable-value-reset" }
                                    ]
                                },

                                "observable-value-reset": {
                                    description: "ObservableValue has not yet been written and is in reset process step.",
                                },

                                "observable-value-ready": {
                                    description: "ObservableValue is ready and processing write action(s)."
                                }

                            } // ~.apm.steps

                        }, // ~.apm

                        subcells: [
                            observableValueProxyWorkerCellModel
                        ]

                    }; // result (CellModel declaration)

                    break;
                }

                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;

           } // ~.cellModelGenerator.generatorFilterBodyFunction

       } // ~.cellModelGenerator

   });

    if (!cmtObservableValue.isValid()) {
        throw new Error(cmtObservableValue.toJSON());
    }

    module.exports = cmtObservableValue;

})();

