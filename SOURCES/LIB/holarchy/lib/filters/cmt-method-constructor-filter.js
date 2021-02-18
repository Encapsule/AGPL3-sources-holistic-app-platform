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
            // WIP
            ____types: "jsObject",
            spaceLabel: { ____accept: "jsString" },
            cellModelGeneratorFilter: { ____accept: "jsObject" } // This will be an @encapsule/arccore.filter object.
        },
        bodyFunction: function(constructorRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

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

                let factoryResponse2 = arccore.filter.create({
                    operationID: cmasHolarchyPackage.mapLabels({ OTHER: cellModelGeneratorFilterLabel }).result.OTHERID,
                    operationName: cellModelGeneratorFilterLabel,
                    operationDescription: `Processes the request value passed from ${cellModelTemplateSynthMethodLabel} method.`,
                    inputFilterSpec: {
                        ____label: `${cellModelGeneratorFilterLabel} Request`,
                        ____description: "A request descriptor object specifying the CellModelTemplate-instance-specific specializations to be used to synthesize a new CellModel.",
                        ____types: "jsObject",

                        cmtInstance: { // This is spliced in by CellModelTemplate::constructor
                            ____label: `${templateLabel} Instance Reference`,
                            ____accept: "jsObject" // This will be a pointer to CellModelTemplate::synthesizeCellModel method's this
                        },

                        cellModelLabel: {
                            ____label: `${templateLabel} Instance Label`,
                            ____description: "A unique and stable label (no spaces, legal JavaScript variable name token) that refers to specialization of of CellModel to be synthesized via this call to CellModelTemplate::synthesizeCellModel method.",
                            ____accept: "jsString" // Note that cellModelLabel is used to call CellModelTemplate.mapLabels method (inherited from CellModelArtifactSpace) and is used e.g. as the value passed { CM: cellModelLabel, APM: cellModelLabel ... }
                        },

                        synthesizeRequest: {
                            ...constructorRequest_.cellModelGenerator.synthesizeMethodRequestSpec,
                            ____label: `${templateLabel} Generator Request`,
                            ____description: `Specific instructions to ${cellModelGeneratorFilterLabel} about how to build a new CellModel instance.`
                        }
                    },
                    outputFilterSpec: {
                        ...CellModelConstructorInputSpec,
                        ____label: "CellModelTemplate::synthesizeCellModel Result",
                        ____description: "A @encapsule/holarchy CellModel::constructor request descriptor object synthesized by this filter."
                    },
                    bodyFunction: function(generateCellModelRequest_) {
                        let response = { error: null };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            try {
                                let innerResponse = constructorRequest_.cellModelGenerator.generatorFilterBodyFunction(generateCellModelRequest_);
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
                    spaceLabel: cmasInstanceScope.getArtifactSpaceLabel(),
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

