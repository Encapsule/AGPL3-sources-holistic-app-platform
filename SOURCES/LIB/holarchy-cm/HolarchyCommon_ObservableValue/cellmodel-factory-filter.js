// ObservableValue-CellModel-factory-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

const lib = require("./lib");

(function() {

    const filterDeclaration  = {
        operationID: "pubMU3fRR7GItLYLDT4ePw",
        operationName: "ObservableValue CellModel Factory",
        operationDescription: "A filter that manufactures an ObservableValue CellModel class instance that is specialized to a specific value type.",

        inputFilterSpec: {
            ____label: "ObservableValue CellModel Factory Request",
            ____description: "Descriptor object sent to ObservableValue CellModel factory with instructions about how to specialize the desired CellModel instance.",
            ____types: "jsObject",
            cellID: { ____accept: "jsString" }, // must be a unique IRUT
            apmID: { ____accept: "jsString" }, // must be a unique IRUT
            valueTypeLabel: { ____accept: "jsString" },
            valueTypeDescription: { ____accept: "jsString" },
            valueTypeSpec: {
                ____label: "Value Data Specification",
                ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
            }
        },

        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel class instance.
        },

        bodyFunction: function(factoryRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let innerResponse = arccore.identifier.irut.isIRUT(factoryRequest_.cellID);
                if (!innerResponse.result) {
                    errors.push(`Invalid cellID value "${factoryRequest_.cellID}": ${innerResponse.guidance}`);
                    break;
                }

                innerResponse = arccore.identifier.irut.isIRUT(factoryRequest_.apmID);
                if (!innerResponse.result) {
                    errors.push(`Invalid apmID value "${factoryRequest_.apmID}": ${innerResponse.guidance}`);
                    break;
                }

                const cellModelDeclaration = {
                    id: factoryRequest_.cellID,
                    name: `${factoryRequest_.valueTypeLabel} ObservableValue Model`,
                    description: `ObservableValue specialization for value type "${factoryRequest_.valueTypeLabel}".`,
                    apm: {
                        id: factoryRequest_.apmID,
                        name: `${factoryRequest_.valueTypeLabel} ObservableValue Process`,
                        description: `ObservableValue specialization for type "${factoryRequest_.valueTypeLabel}". Value description "${factoryRequest_.valueTypeDescription}"`,
                        ocdDataSpec: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            value: { ...factoryRequest_.valueTypeSpec },
                            revision: { ____types: "jsNumber", ____defaultValue: -1 },
                        },
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
                    },
                    actions: [

                        // ----------------------------------------------------------------
                        {
                            id: arccore.identifier.irut.fromReference(`${factoryRequest_.cellID}.action.reset`).result,
                            name: `${factoryRequest_.valueTypeLabel} ObservableValue Reset`,
                            description: `Resets the ${factoryRequest_.valueTypeLabel} ObservableValue cell process.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holarchy: {
                                    ____types: "jsObject",
                                    cm: {
                                        ____types: "jsObject",
                                        actions: {
                                            ____types: "jsObject",
                                            ObservableValue: {
                                                ____types: "jsObject",
                                                reset: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: {
                                ____accept: "jsString",
                                ____defaultValue: "okay"
                            },
                            bodyFunction: function(actionRequest_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;
                                    let libResponse = lib.getStatus({ ...actionRequest_.context, apmID: factoryRequest_.apmID });
                                    if (libResponse.error) {
                                        errors.push(libResponse.error);
                                        break;
                                    }
                                    // const { cellMemory, cellProcess } = libResponse.result;
                                    let ocdResponse = actionRequest_.context.ocdi.writeNamespace(apmBindingPath, {});
                                    if (ocdResponse.error) {
                                        errors.push(ocdResponse.error);
                                        break;
                                    }
                                    break;
                                }
                                if (errors.length) {
                                    response.error = errors.join(" ");
                                }
                                return response;
                            } // bodyFunction
                        }, // action: holarchy.cm.actions.ObservableValue.reset

                        // ----------------------------------------------------------------
                        {
                            id: arccore.identifier.irut.fromReference(`${factoryRequest_.cellID}.action.write`).result,
                            name: `${factoryRequest_.valueTypeLabel} ObservableValue Write`,
                            description: `Writes a new value to a ${factoryRequest_.valueTypeLabel} ObservableValue cell process.`,
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holarchy: {
                                    ____types: "jsObject",
                                    cm: {
                                        ____types: "jsObject",
                                        actions: {
                                            ____types: "jsObject",
                                            ObservableValue: {
                                                ____types: "jsObject",
                                                write:{
                                                    ____types: "jsObject",
                                                    value: factoryRequest_.valueTypeSpec
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: {
                                ____accept: "jsString",
                                ____defaultValue: "okay"
                            },
                            bodyFunction: function(actionRequest_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;
                                    let libResponse = lib.getStatus({ ...actionRequest_.context, apmID: factoryRequest_.apmID });
                                    if (libResponse.error) {
                                        errors.push(libResponse.error);
                                        break;
                                    }
                                    const { cellMemory, cellProcess } = libResponse.result;
                                    const messageBody = actionRequest_.actionRequest.holarchy.cm.actions.ObservableValue.write;
                                    cellMemory.__apmiStep = "observable-value-ready",
                                    cellMemory.value = messageBody.value;
                                    cellMemory.revision += 1;
                                    let ocdResponse = actionRequest_.context.ocdi.writeNamespace(cellProcess.apmBindingPath, cellMemory);
                                    if (ocdResponse.error) {
                                        errors.push(ocdResponse.error);
                                        break;
                                    }
                                    break;
                                }
                                if (errors.length) {
                                    response.error = errors.join(" ");
                                }
                                return response;
                            } // bodyFunction
                        } // action holarcy.cm.actions.ObservableValue.write.value

                    ],
                    operators: [
                    ],
                    subcells: [
                    ]
                };

                const cellModel = new holarchy.CellModel(cellModelDeclaration);
                if (!cellModel.isValid()) {
                    errors.push(cellModel.toJSON());
                    break;
                }

                response.result = cellModel;

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    };

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

