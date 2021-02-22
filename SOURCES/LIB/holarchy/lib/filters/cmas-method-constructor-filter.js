// CellModelArtifactSpace-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");

    const cmasConstructorRequestSpec = {
        ____label: "CellModelArtifactSpace::constructor Request",
        ____description: "Descriptor object passed into the CellModelArtifactSpace class constructor function.",
        ____types: "jsObject",
        ____defaultValue: {},
        spaceLabel: {
            ____label: "Artifact Space Label",
            ____description: "A unique string label used to identify the specific CellModel artifact space to use to resolve CellModel artifact label queries.",
            ____accept: "jsString"
        }
    };

    const factoryResponse1 = arccore.filter.create({

        operationID: "kNjJehTFRz2WhRHkuL9kWA",
        operationName: "CellModelArtifactSpace::constructor",
        operationDescription: "CellModelArtifactSpace::constructor function request input filter.",

        inputFilterSpec: cmasConstructorRequestSpec,
        outputSpec: {
            ____types: "jsObject",
            artifactSpaceLabel: {
                ____accept: "jsString"
            },
            mapLabelsMethodFilter: {
                ____accept: "jsObject" // This will be an @encapsule/arccore.filter object.
            },
            makeSubspaceInstanceMethodFilter: {
                ____accept: "jsObject" // This will be an @encapsule/arccore.filter object.
            }
        },

        bodyFunction(constructorRequest_) {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                const { spaceLabel } = constructorRequest_;

                if (spaceLabel.length === 0) {
                    errors.push("You must specify a spaceLabel value of one or more character(s) in length.");
                    break;
                }

                const artifactSpaceLabel = `${spaceLabel}`;

                // Create a filter that implements the mapLabels method.

                const factoryResponse2 = arccore.filter.create({

                    operationID: arccore.identifier.irut.fromReference(`CellModelArtifactSpace<${artifactSpaceLabel}>::mapLabels`).result,
                    operationName: `CellModelArtifactSpace::mapLabels<${artifactSpaceLabel}>`,
                    operationDescription: `A filter that implements the CellModelArtifactSpace<${artifactSpaceLabel}>::mapLabels class method.`,

                    inputFilterSpec: {
                        ____label: `CellModelArtifactSpace::mapLabels<${artifactSpaceLabel}> Request`,
                        ____description: `CellModelArtifactSpace::mapLabels method request descriptor object for space "${artifactSpaceLabel}".`,
                        ____types: "jsObject",
                        ____defaultValue: {},
                        CM: { ____accept: [ "jsUndefined", "jsString" ] },
                        APM: { ____accept: [ "jsUndefined", "jsString" ] },
                        // CAUTION: A specific CellModelArtifactSpace instance will map unique CM and APM labels to unique CMID and APMID.
                        // But, will NOT DO WHAT YOU MIGHT WANT for ACT/TOP/OTHER. Note that ACT/TOP are specifically 1:N w/CM label
                        // (i.e. Within CMAS X we can have CM labels A, B, C. A may have ACT "foo" and B may also have ACT "foo".
                        // You can:
                        // - Specify your ACT labels explicitly as "${cellLabel}${actLabel}"
                        // - If you're defining ACT/TOP in separate modules oftentimes we just grab CMAS and call makeSubspaceIntance passing in the cellLabel as the spaceLabel value.
                        ACT: { ____accept: [ "jsUndefined", "jsString" ] },
                        TOP: { ____accept: [ "jsUndefined", "jsString" ] },
                        OTHER: { ____accept: [ "jsUndefined", "jsString" ] } // SAME CAUTIONS HERE --- you can do whatever you want w/this.
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
                        TOPID: { ____accept: [ "jsUndefined", "jsString" ] },
                        OTHER: { ____accept: [ "jsUndefined", "jsString" ] },
                        OTHERID: { ____accept: [ "jsUndefined", "jsString" ] }
               },

                    bodyFunction: function(mapLabelsRequest_) {
                        return ({
                            error: null,
                            result: {
                                ...mapLabelsRequest_,
                                CMID:  mapLabelsRequest_.CM?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.CellModel.${mapLabelsRequest_.CM}`).result:undefined,
                                APMID: mapLabelsRequest_.APM?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.AbstractProcessModel.${mapLabelsRequest_.APM}`).result:undefined,
                                ACTID: mapLabelsRequest_.ACT?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.ControllerAction.${mapLabelsRequest_.ACT}`).result:undefined,
                                TOPID: mapLabelsRequest_.TOP?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.TransitionOperator.${mapLabelsRequest_.TOP}`).result:undefined,
                                OTHERID: mapLabelsRequest_.OTHER?arccore.identifier.irut.fromReference(`${artifactSpaceLabel}.OtherAsset.${mapLabelsRequest_.OTHER}`).result:undefined
                            }
                        });
                    }
                });

                if (factoryResponse2.error) {
                    errors.push(factoryResponse2.error);
                    break;
                }

                const mapLabelsMethodFilter = factoryResponse2.result;

                // Create a filter that implements the makeSubspaceInstance method.

                factoryResponse2 = arccore.filter.create({
                    operationID: arccore.identifier.irut.fromReference(`CellModelArtifactSpace<${artifactSpaceLabel}>::makeSubspaceInstance`).result,
                    operationName: `CellModelArtifactSpace<${artifactSpaceLabel}>::makeSubspaceInstance`,
                    operationDescription: `A filter that implements the CellModelArtifactSpace<${artifactSpaceLabel}>::makeSubspaceInstance class method.`,

                    inputFilterSpec: cmasConstructorRequestSpec,
                    outputFilterSpec:cmasConstructorRequestSpec,
                    bodyFunction(request_) {
                        let response = { error: null };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            // Here a "subspace" is an artifact space "boundary". U+2202 (stylized d) is used here to demarcate the boundary.
                            response.result = { spaceLabel: `${artifactSpaceLabel}∂${request_.spaceLabel}` };
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

                const makeSubspaceInstanceMethodFilter = factoryResponse2.result;

                response.result = {
                    artifactSpaceLabel,
                    mapLabelsMethodFilter,
                    makeSubspaceInstanceMethodFilter
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

