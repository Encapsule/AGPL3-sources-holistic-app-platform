// ObservableValueWorker_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const templateLabel = "ObservableValueWorker";

    const cmtObservableValueWorker = new holarchy.CellModelTemplate({
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
            }, // ~.cellModelGenerator.synthesizeMethodRequestSpec
            generatorFilterBodyFunction: function(request_) {
                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;


                    response.result =  {
                        id: request_.cmtInstance.mapLabels({ CM: request_.cellModelLabel }).result.CMID,
                        name: `${templateLabel}<${request_.cellModelLabel}>`,
                        description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,
                        apm: {
                            id: request_.cmtInstance.mapLabels({ APM: request_.cellModelLabel }).result.APMID,
                            name: `${templateLabel}<${request_.cellModelLabel}>`,
                            description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,

                            ocdDataSpec: {
                                ____types: "jsObject",
                                ____defaultValue: {},

                                // This is a proxy helper cell that is connected to a specific ObservableValue cell instance.
                                observableValueProxy: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /*Holarchy Cell Process Proxy*/ }
                                },

                                valueObserver: {
                                    ____accept: "jsBoolean",
                                    ____defaultValue: true
                                }
                            },
                            steps: {
                                "uninitialized": {
                                    description: "Default starting step.",
                                    transitions: [
                                        { transitionIf: { always: true }, nextStep: "value-observer-worker-initialize" }
                                    ]
                                },
                                "value-observer-worker-initialize": {
                                    description: "The ValueObserverWorker process is initializing."
                                }
                            }
                        },
                        actions: [
                        ],
                        operators: [
                        ],
                        subcells: [
                        ]
                    };

                    break;
                }
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            } // ~.cellModelGenerator.generatorFilterBodyFunction
        } // ~.cellModelGenerator
    });

    if(!cmtObservableValueWorker.isValid()) {
        throw new Error(cmtObservableValueWorker.toJSON());
    }

    module.exports = cmtObservableValueWorker;

})();

