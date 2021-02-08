// CellModelArtifactSpace-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");

    const factoryResponse1 = arccore.filter.create({

        operationID: "kNjJehTFRz2WhRHkuL9kWA",
        operationName: "CellModelArtifactSpace::constructor",
        operationDescription: "CellModelArtifactSpace::constructor function request input filter.",

        inputFilterSpec: {
            ____label: "HolarchyArtifactSpaceMapper::constructor Request",
            ____description: "Descriptor object passed into the CellModelArtifactSpace class constructor function.",
            ____types: "jsObject",
            ____defaultValue: {},
            spaceLabel: {
                ____label: "Artifact Space Label",
                ____description: "A unique string label used to identify the specific CellModel artifact space to use to resolve CellModel artifact label queries.",
                ____accept: "jsString",
                ____defaultValue: "default"
            }
        },

        outputSpec: {
            ____types: "jsObject",
            artifactSpaceLabel: {
                ____accept: "jsString"
            },
            artifactSpaceLabelQueryFilter: {
                ____accept: "jsObject" // This will be an @encapsule/arccore.filter object
            }
        },

        bodyFunction(constructorRequest_) {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                const { spaceLabel } = constructorRequest_;

                const artifactSpaceLabel = `@encapsule/holarchy.CellModelArtifactSpace.${spaceLabel}`;

                const factoryResponse2 = arccore.filter.create({

                    operationID: arccore.identifier.irut.fromReference(`CellModelArtifactSpace::mapLabels<${artifactSpaceLabel}>`).result,
                    operationName: `CellModelArtifactSpace::mapLabels<${artifactSpaceLabel}>`,
                    operationDescription: `A request filter that accepts a set of artifact label strings to map to CellModel artifact IRUT strings within the scope of a CellModelArtifactSpace<${artifactSpaceLabel}> class instance.`,

                    inputFilterSpec: {
                        ____label: `CellModelArtifactSpace::mapLabels<${artifactSpaceLabel}> Request`,
                        ____description: `CellModelArtifactSpace::mapLabels method request descriptor object for space "${artifactSpaceLabel}".`,
                        ____types: "jsObject",
                        ____defaultValue: {},
                        CM: { ____accept: [ "jsUndefined", "jsString" ] },
                        APM: { ____accept: [ "jsUndefined", "jsString" ] },
                        ACT: { ____accept: [ "jsUndefined", "jsString" ] },
                        TOP: { ____accept: [ "jsUndefined", "jsString" ] }
                    },

                    outputFilterSpec: {
                        ____label: "Artifact Space Mapping",
                        ____types: "jsObject",
                        CM: { ____accept: [ "jsUndefined", "jsString" ] },
                        CMID: { ____accept: [ "jsUndefined", "jsString"] },
                        APM: { ____accept: [ "jsUndefined", "jsString" ] },
                        APMID: { ____accept: [ "jsUndefined", "jsString" ] },
                        ACT: { ____accept: [ "jsUndefined", "jsString" ] },
                        ACTID: { ____accept: [ "jsUndefined", "jsString" ] },
                        TOP: { ____accept: [ "jsUndefined", "jsString" ] },
                        TOPID: { ____accept: [ "jsUndefined", "jsString" ] }
                    },

                    bodyFunction: function(mapLabelsRequest_) {
                        return ({
                            error: null,
                            result: {
                                ...mapLabelsRequest_,
                                CMID:  mapLabelsRequest_.CM?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.CellModel.${mapLabelsRequest_.CM}`).result:undefined,
                                APMID: mapLabelsRequest_.APM?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.AbstractProcessModel.${mapLabelsRequest_.APM}`).result:undefined,
                                ACTID: mapLabelsRequest_.ACT?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.ControllerAction.${mapLabelsRequest_.ACT}`).result:undefined,
                                TOPID: mapLabelsRequest_.TOP?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.TransitionOperator.${mapLabelsRequest_.TOP}`).result:undefined
                            }
                        });
                    }
                });

                if (factoryResponse2.error) {
                    errors.push(factoryResponse2.error);
                    break;
                }

                response.result = {
                    artifactSpaceLabel,
                    artifactSpaceMapperFilter: factoryResponse2.result
                };
                break;
            }

            if (errors.length) {
                response.error = errors.join(" ");
            }

            return response;

        }
    });

    if (factoryResponse1.error) {
        throw new Error(factoryResponse1.error);
    }

    const constructorFilter = factoryResponse1.result;

    module.exports = constructorFilter;

})();

