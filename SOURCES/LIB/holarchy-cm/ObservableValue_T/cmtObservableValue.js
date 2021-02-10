// cmtObservableValue.js

(function() {

    const CellModelTemplate = require("../CellModelTemplate");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const cellLib = require("./celllib");
    const templateLabel = "ObservableValue";

    const cmtObservableValue = new CellModelTemplate({
        cmasBaseScope: cmasHolarchyCMPackage,
        templateLabel,
        generateCellModelFilterInputSpec: {
            ____label: `${templateLabel}<X> Specialization Request`,
            ____types: "jsObject",
            valueTypeDescription: { ____accept: "jsString" },
            valueTypeSpec: {
                ____label: "Value Data Specification",
                ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
            }
        },
        generateCellModelFilterBodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const cellMemorySpec = {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    value: { ...request_.generatorRequest.valueTypeSpec },
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


                        }
                    }
                };

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (!cmtObservableValue.isValid()) {
        throw new Error(cmtObservableValue.toJSON());
    }

    module.exports = cmtObservableValue;


})();

