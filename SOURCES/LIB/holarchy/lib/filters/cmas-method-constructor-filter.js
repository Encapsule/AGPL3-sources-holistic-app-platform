// CellModelArtifactSpace-method-constructor-filter.js

(function() {

    // v0.0.60-andesine --- I have modified the logic in this module to produce IRUT ID's
    // with a much better random value distribution so that closely related labels produce
    // generally visually distinctive, dissimlar, IRUT values (e.g. two labels in same same
    // that differ only by their last character). This is good enough for now. But, the real
    // issue is a difficiency in @encapsule/arccore.identifier.irut.fromReference implementation
    // that should implement a better idempotent scrambler on the label before performing
    // murmur hashing and serialization to final 22-char string format.

    const arccore = require("@encapsule/arccore");

    const cmasConstructorRequestSpec = require("./iospecs/cmas-method-constructor-input-spec");

    const factoryResponse1 = arccore.filter.create({

        operationID: "kNjJehTFRz2WhRHkuL9kWA",
        operationName: "CellModelArtifactSpace::constructor",
        operationDescription: "CellModelArtifactSpace::constructor function request input filter.",

        inputFilterSpec: cmasConstructorRequestSpec,
        outputSpec: {
            ____types: "jsObject",
            spaceLabel: { ____accept: "jsString" },
            spaceID: { ____accept: "jsString" },
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

                const spaceLabelReverse = spaceLabel.split("").reverse().join("");
                const splitPoint = Math.round(spaceLabelReverse.length / 2);
                const spaceLabelReverseSplit = { a: spaceLabelReverse.slice(0, splitPoint), b: spaceLabelReverse.slice(splitPoint, spaceLabelReverse.length) };

                const spaceID = arccore.identifier.irut.fromReference(`${spaceLabelReverseSplit.b}.e36azEvFSkmAC9MlYT6lZA.${spaceLabelReverseSplit.a}.IcH9EeK6SPyFgqjAPxGh4w`).result; // should be no perceptible relationship between IRUT created from closely-related label strings

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
                            const keys = Object.keys(mapLabelsRequest_);
                            const scrambleRequest = {};
                            keys.forEach((key_) => {
                                // console.log(key_);
                                if (mapLabelsRequest_[key_] !== undefined) {
                                    if (["CM", "APM", "ACT", "TOP", "OTHER" ].indexOf(key_) > -1) {
                                        if (mapLabelsRequest_[key_].length === 0) {
                                            errors.push(`!!! DISCARDING BAD ${key_} VALUE "${mapLabelsRequest_[key_]}"!`);
                                            errors.push(`Error in space "${mapLabelsRequest_.cmasInstance.spaceLabel}".`);
                                            delete mapLabelsRequest_[key_]; // JUST IGNORE THE BAD INPUT LABEL
                                        } else {
                                            if (["ACT", "TOP"].indexOf(key_) > -1) {
                                                const cmLabel = mapLabelsRequest_.CM;
                                                if ((cmLabel === undefined) || (cmLabel.length === 0)) {
                                                    errors.push(`!!! DISCARDING BAD ${key_} VALUE "${mapLabelsRequest_[key_]}" SPECIFIED w/OUT ALSO SPECIFYING CM LABEL!`);
                                                    errors.push(`Error in space "${mapLabelsRequest_.cmasInstance.spaceLabel}".`);
                                                    delete mapLabelsRequest_[key_]; // JUST IGNORE THE BAD INPUT LABEL
                                                }
                                            }
                                            if (!errors.length) {
                                                scrambleRequest[key_] = mapLabelsRequest_[key_].split("").reverse().join("");
                                            }
                                        }
                                    }
                                }
                            });

                            response.result = {
                                ...mapLabelsRequest_,
                                cmasInstance: undefined,
                                CMID:  mapLabelsRequest_.CM?arccore.identifier.irut.fromReference(`${scrambleRequest.CM}_CellModel_${mapLabelsRequest_.cmasInstance._private.spaceID}_UmROjf09T5exKvVqlP5Wtw`).result:undefined,
                                APMID: mapLabelsRequest_.APM?arccore.identifier.irut.fromReference(`${scrambleRequest.APM}_AbstractProcessModel_${mapLabelsRequest_.cmasInstance._private.spaceID}_szLs1awWSzK56Vtj6o3qAw`).result:undefined,
                                ACTID: mapLabelsRequest_.ACT?arccore.identifier.irut.fromReference(`${scrambleRequest.ACT}_ControllerAction_${mapLabelsRequest_.CM}${mapLabelsRequest_.cmasInstance._private.spaceID}_97JU5UMKTYSphoP2Eh3Pow`).result:undefined,
                                TOPID: mapLabelsRequest_.TOP?arccore.identifier.irut.fromReference(`${scrambleRequest.TOP}_TransitionOperator_${mapLabelsRequest_.CM}${mapLabelsRequest_.cmasInstance._private.spaceID}_gs2Q6ItMQde2-J_pJTZyeA`).result:undefined,
                                OTHERID: mapLabelsRequest_.OTHER?arccore.identifier.irut.fromReference(`${scrambleRequest.OTHER}_OtherArtifact_${mapLabelsRequest_.cmasInstance._private.spaceID}_jTK_Vk7ASq6ofZhcTdqDbQ`).result:undefined
                            };

                            break;

                        }

                        if (errors.length) {
                            response.error = errors.join(" ");
                            // We expect to only hit errors here during development when labels might have been changed.
                            console.warn(response.error);
                        }

                        // NOTE: We use @encapsule/arccore.filter response format fully here.
                        // If response.error !== null then response.error is the error string.
                        // And, response.result is considered invalid AND IS TREATED AS OPAQUE
                        // by filter. But, we know mostly we'll not be checking response.error
                        // on this specific call because errors are FATAL and only expected to
                        // occur during development. Normally we would want to force people to
                        // check response.error before using response.result because it's the
                        // only opportunity to inform them of the details of the failure. However,
                        // in this case it will be obvious --- a bad mapLabels will cause some
                        // or another artifact to get a bad ID. And, this will create an obviously
                        // broken situation that developers will be able to spot and correct
                        // quickly. And, so we always return response.result no matter what in
                        // a baseline usable form (because response.error is %0.1 case).

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
                            if (!makeSubspaceInstanceRequest_.spaceLabel.length) {
                                errors.push("You must specify a spaceLabel value of one or more character. Invalid zero-length spaceLabel rejected.");
                                break;
                            }
                            // Here a "subspace" is an artifact space "boundary". U+2202 (stylized d) is used here to demarcate the boundary.
                            // See also: https://en.wikipedia.org/wiki/%E2%88%82 <- NOTE: "...or the conjugate of the Dolbeault operator on smooth differential forms over a complex manifold." (https://en.wikipedia.org/wiki/Manifold)
                            // ... Enough for now, when we can see it we will talk more & speculate about what it means. It's pretty deep.
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

                response.result = { spaceLabel, spaceID, mapLabelsMethodFilter, makeSubspaceInstanceMethodFilter };

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

