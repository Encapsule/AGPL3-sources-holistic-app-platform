// CellModelArtifactSpace-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");

    const cmasConstructorRequestSpec = require("./iospecs/cmas-method-constructor-input-spec");

    const factoryResponse1 = arccore.filter.create({

        operationID: "kNjJehTFRz2WhRHkuL9kWA",
        operationName: "CellModelArtifactSpace::constructor",
        operationDescription: "CellModelArtifactSpace::constructor function request input filter.",

        inputFilterSpec: cmasConstructorRequestSpec,
        outputSpec: {
            ____types: "jsObject",
            spaceLabel: {
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

                const { spaceLabel } = constructorRequest_; // We may add parameters to constructor request in the future which is why it's an object

                if (spaceLabel.length === 0) {
                    errors.push("You must specify a spaceLabel value of one or more character(s) in length.");
                    break;
                }

                // Create a filter that implements the mapLabels method.

                const factoryResponse2 = arccore.filter.create({

                    operationID: arccore.identifier.irut.fromReference(`CellModelArtifactSpace<${spaceLabel}>::mapLabels`).result,
                    operationName: `CellModelArtifactSpace::mapLabels<${spaceLabel}>`,
                    operationDescription: `A filter that implements the CellModelArtifactSpace<${spaceLabel}>::mapLabels class method.`,

                    inputFilterSpec: {
                        ____label: `CellModelArtifactSpace::mapLabels<${spaceLabel}> Request`,
                        ____description: `CellModelArtifactSpace::mapLabels method request descriptor object for space "${spaceLabel}".`,
                        ____types: "jsObject",
                        ____defaultValue: {},
                        cmasInstance: { ____accept: "jsObject" }, // This is a pointer to a CellModelArtifactSpace class instance. Or, CellModelTemplate class instance that extends the same.
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
                        let response = { error: null };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;

                            // REJECT ZERO-LENGTH AND ENFORCE CM && ACT || CM && TOP
                            let badCheck = false;

                            const keys = Object.keys(mapLabelsRequest_);

                            keys.forEach((key_) => {
                                console.log(key_);
                                if (mapLabelsRequest_[key_] !== undefined) {
                                    if (["CM", "APM", "ACT", "TOP", "OTHER" ].indexOf(key_) > -1) {

                                        if (mapLabelsRequest_[key_].length === 0) {

                                            console.error(`!!! DISCARDING BAD ${key_} VALUE "${mapLabelsRequest_[key_]}"!`);
                                            console.log(`Error in space "${mapLabelsRequest_.cmasInstance.spaceLabel}".`);
                                            delete mapLabelsRequest_[key_];

                                        } else {

                                            if (["ACT", "TOP"].indexOf(key_) > -1) {

                                                const cmLabel = mapLabelsRequest_.CM;
                                                if ((cmLabel === undefined) || (cmLabel.length === 0)) {
                                                    console.error(`!!! DISCARDING BAD ${key_} VALUE "${mapLabelsRequest_[key_]}" SPECIFIED w/OUT ALSO SPECIFYING CM LABEL!`);
                                                    console.log(`Error in space "${mapLabelsRequest_.cmasInstance.spaceLabel}".`);
                                                    delete mapLabelsRequest_[key_];
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            response.result = {
                                ...mapLabelsRequest_,
                                cmasInstance: undefined,
                                CMID:  mapLabelsRequest_.CM?arccore.identifier.irut.fromReference(`${mapLabelsRequest_.cmasInstance.spaceLabel}.CellModel.${mapLabelsRequest_.CM}`).result:undefined,
                                APMID: mapLabelsRequest_.APM?arccore.identifier.irut.fromReference(`${mapLabelsRequest_.cmasInstance.spaceLabel}.AbstractProcessModel.${mapLabelsRequest_.APM}`).result:undefined,
                                ACTID: mapLabelsRequest_.ACT?arccore.identifier.irut.fromReference(`${mapLabelsRequest_.cmasInstance.spaceLabel}.ControllerAction.${mapLabelsRequest_.CM}::${mapLabelsRequest_.ACT}`).result:undefined,
                                TOPID: mapLabelsRequest_.TOP?arccore.identifier.irut.fromReference(`${mapLabelsRequest_.cmasInstance.spaceLabel}.TransitionOperator.${mapLabelsRequest_.CM}::${mapLabelsRequest_.TOP}`).result:undefined,
                                OTHERID: mapLabelsRequest_.OTHER?arccore.identifier.irut.fromReference(`${mapLabelsRequest_.cmasInstance.spaceLabel}.OtherAsset.${mapLabelsRequest_.OTHER}`).result:undefined
                            };

                            break;

                        }

                        if (errors.length) {
                            response.error = errors.join(" ");
                        }

                        console.log(JSON.stringify(response));
                        return response;
                    }
                });

                if (factoryResponse2.error) {
                    errors.push(factoryResponse2.error);
                    break;
                }

                const mapLabelsMethodFilter = factoryResponse2.result;

                // Create a filter that implements the makeSubspaceInstance method.

                factoryResponse2 = arccore.filter.create({
                    operationID: arccore.identifier.irut.fromReference(`CellModelArtifactSpace<${spaceLabel}>::makeSubspaceInstance`).result,
                    operationName: `CellModelArtifactSpace<${spaceLabel}>::makeSubspaceInstance`,
                    operationDescription: `A filter that implements the CellModelArtifactSpace<${spaceLabel}>::makeSubspaceInstance class method.`,
                    inputFilterSpec: { ...cmasConstructorRequestSpec, cmasInstance: { ____accept: "jsObject" } },
                    outputFilterSpec:cmasConstructorRequestSpec,
                    bodyFunction(makeSubspaceInstanceRequest_) {
                        let response = { error: null };
                        let errors = [];
                        let inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            // Here a "subspace" is an artifact space "boundary". U+2202 (stylized d) is used here to demarcate the boundary.
                            response.result = { spaceLabel: `${makeSubspaceInstanceRequest_.cmasInstance.spaceLabel}∂${makeSubspaceInstanceRequest_.spaceLabel}` };
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

                response.result = { spaceLabel, mapLabelsMethodFilter, makeSubspaceInstanceMethodFilter };

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

