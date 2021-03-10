// cmt-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");
    const CellModelArtifactSpace = require("../../CellModelArtifactSpace");
    const CellModelConstructorInputSpec = require("./iospecs/cm-method-constructor-input-spec");

    const cmasHolarchyPackage = require("../../cmasHolarchyPackage");

    const factoryResponse = arccore.filter.create({
        operationID: cmasHolarchyPackage.mapLabels({ OTHER: "CellModelTemplate::constructor Filter" }).result.OTHERID,
        operationName: "CellModelTemplate::constructor Filter",
        operationDescription: "Processes the request value passed to CellModelTemplate::constructor function.",
        inputFilterSpec: require("./iospecs/cmt-method-constructor-input-spec"),
        outputFilterSpec: {
            ____types: "jsObject",
            spaceLabel: { ____accept: "jsString" },
            templateLabel: { ____accept: "jsString" },
            generatorBodyFunction: { ____accept: "jsFunction" }, // This will be a raw function.
            cellModelGeneratorFilter: { ____accept: "jsObject" } // This will be an @encapsule/arccore.filter object.
        },
        bodyFunction: function(constructorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                if (!constructorRequest_.templateLabel.length) {
                    errors.push("You must specify a templateLabel value of one or more characters. Invalid zero-length templateLabel rejected.");
                    break;
                }

                let cmasTemplateScope = (constructorRequest_.cmasScope instanceof CellModelArtifactSpace)?constructorRequest_.cmasScope:(new CellModelArtifactSpace(constructorRequest_.cmasScope));

                if (!cmasTemplateScope.isValid()) {
                    errors.push(cmasTemplateScope.toJSON());
                    break;
                }

                const cmasInstanceScope = cmasTemplateScope.makeSubspaceInstance({ spaceLabel: constructorRequest_.templateLabel });

                if (!cmasInstanceScope.isValid()) {
                    errors.push(cmasInstanceScope.toJSON());
                    break;
                }

                const templateLabel = `CellModelTemplate<${constructorRequest_.templateLabel}>`;
                const cellModelTemplateSynthMethodLabel = `${templateLabel}::synthesizeCellModel`;
                const cellModelGeneratorFilterLabel = `${templateLabel}::cellModelGeneratorFilter`;

                // Construct the specialized CellModel generator filter instance.

                // CellModelTemplate::synthesizeCellModel method delegates to the cellModelGeneratorFilter created here...

                let factoryResponse2 = arccore.filter.create({
                    operationID: cmasHolarchyPackage.mapLabels({ OTHER: cellModelGeneratorFilterLabel }).result.OTHERID,
                    operationName: cellModelGeneratorFilterLabel,
                    operationDescription: `Processes the request value passed from ${cellModelTemplateSynthMethodLabel} method.`,
                    inputFilterSpec: {
                        ____label: `${cellModelGeneratorFilterLabel} Request`,
                        ____description: "A request descriptor object specifying the CellModelTemplate-instance-specific specializations to be used to synthesize a new CellModel.",
                        ____types: "jsObject",

                        // Provided by the CellModelTemplate::synthesizeCellModel method implementation that forwards its class constructor reference.
                        cmtClass: {
                            ____label: "CellModelTemplate::constructor Function",
                            ____accept: "jsFunction"
                        },

                        // Provided by the CellModelTemplate::synthesizeCellModel method implementation that forwards its this reference.
                        cmtInstance: {
                            ____label: `${templateLabel} Instance Reference`,
                            ____accept: "jsObject" // This will be a pointer to CellModelTemplate::synthesizeCellModel method's this
                        },

                        // Provided by caller via CellModelTemplate::synthesizeCellModel request descriptor
                        cmasScope: {
                            ____label: `{templateLabel}::synthesizeCellModel CMAS`,
                            ____description: "Optional reference to a CellModelArtifactSpace or CellModelTemplate class instance that specifies which CMAS the new CellModel's IRUTs should be generated in.",
                            ____accept: [
                                "jsUndefined", // If not specified then CellModelTemplate::synthesizeCellModel uses the template instance's intrinsic CMAS that was assigned at construction-time.
                                "jsObject",    // If specified, the CellModelTemplate::synthesizeCellModel uses the specified CMAS instead of its intrinsic CMAS when generating CellModel artifact IRUTs. (used when generating specialized CellModel from a template inside of another template)
                            ]
                        },

                        // Provided by caller via CellModelTemplate::synthesizeCellModel request descriptor
                        cellModelLabel: {
                            ____label: `${templateLabel} Instance Label`,
                            ____description: "A unique and stable label (no spaces, legal JavaScript variable name token) that refers to specialization of of CellModel to be synthesized via this call to CellModelTemplate::synthesizeCellModel method.",
                            ____accept: "jsString" // Note that cellModelLabel is used to call CellModelTemplate.mapLabels method (inherited from CellModelArtifactSpace) and is used e.g. as the value passed { CM: cellModelLabel, APM: cellModelLabel ... }
                        },

                        // Provided by caller via CellModelTemplate::synthesizeCellModel request descriptor
                        specializationData: {
                            ...constructorRequest_.cellModelGenerator.specializationDataSpec,
                            ____label: `${templateLabel} Instance Specialization & Config Data`,
                            ____description: `Specific instructions to ${cellModelGeneratorFilterLabel} about how to build a new CellModel instance.`
                        }
                    },
                    outputFilterSpec: {
                        ...CellModelConstructorInputSpec,
                        ____label: "CellModelTemplate::synthesizeCellModel Result",
                        ____description: "A @encapsule/holarchy CellModel::constructor request descriptor object synthesized by this filter."
                    },
                    bodyFunction: function(generateRequest_) {
                        let response = { error: null };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            try {

                                let cmtInstance = generateRequest_.cmtInstance; // According to the CellModelTemplate class instance.

                                if (generateRequest_.cmasScope) { // ... but, whomever is calling synthesizeCellModel wants to use their own CMAS instead of our template's intrinsic CMAS. Okay...

                                    // cmasSynthScope is (or should be) one of several types of objects:
                                    // - CellModelArtifactSpace class instance
                                    // ? CellModelArtifactSpace::constructor request - Seems rather an exotic case. The main use case is to pass in reference to a cmtInstance here from another generatorBodyFunction.
                                    // - CellModelTemplate class instance that extends CellModelArtifactSpace
                                    // X CellModelTemplate::constructor request --- NAH, not going to support this option
                                    // Determine which of these and instantiate a new CellModelTemplate based on generateCellModelReqeust_.cmtInstance

                                    // We really don't care if the caller passed us a CellModelTemplate instance. We just want to know its CMAS.
                                    let cmasScope = (generateRequest_.cmasScope instanceof CellModelArtifactSpace)?generateRequest_.cmasScope:(new CellModelArtifactSpace(generateRequest_.cmasScope));
                                    if (!cmasScope.isValid()) {
                                        errors.push(cmasScope.toJSON());
                                        break;
                                    }
                                    // Now we need a new CellModelTemplate instance to pass to our generatorBodyFunction instead of our own...
                                    // Note that the new CellModelTemplate instance does exactly what this one does. Except, that CellModel
                                    // generated via the instance's synthesizeCellModel method will be placed in the specified CMAS.

                                    cmtInstance = new generateRequest_.cmtClass({
                                        cmasScope,
                                        templateLabel: generateRequest_.cmtInstance._private.templateLabel,
                                        cellModelGenerator: {
                                            specializationDataSpec: generateRequest_.cmtInstance._private.cellModelGeneratorFilter.filterDescriptor.inputFilterSpec.specializationData,
                                            generatorFilterBodyFunction: generateRequest_.cmtInstance._private.generatorBodyFunction
                                        }
                                    });
                                    if (!cmtInstance.isValid()) {
                                        errors.push(cmtInstance.toJSON());
                                        break;
                                    }
                                    cmtInstance._private.spaceLabel = cmasScope.spaceLabel; // zap the spaceLabel and keep everything else the same. This keeps the template names nice.

                                }

                                const innerRequest = {
                                    cmtInstance,
                                    cellModelLabel: generateRequest_.cellModelLabel,
                                    specializationData: generateRequest_.specializationData
                                };

                                let innerResponse = generateRequest_.cmtInstance._private.generatorBodyFunction(innerRequest);
                                if (innerResponse.error) {
                                    errors.push(innerResponse.error);
                                    break;
                                }
                                response.result = innerResponse.result;
                            } catch (exception_) {
                                errors.push(exception_.message);
                                break;
                            }
                            break;
                        }
                        if (errors.length) {
                            response.error = errors.join(" ");
                        }
                        return response;
                    }
                });

                if (factoryResponse2.error) {
                    errors.push(factoryResponse2.error);
                    break;
                }

                const cellModelGeneratorFilter = factoryResponse2.result;

                response.result = {
                    spaceLabel: cmasInstanceScope.spaceLabel,
                    templateLabel: constructorRequest_.templateLabel,
                    generatorBodyFunction: constructorRequest_.cellModelGenerator.generatorFilterBodyFunction,
                    cellModelGeneratorFilter
                };

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

