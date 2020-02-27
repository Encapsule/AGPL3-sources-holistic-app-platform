// cm-method-get-config-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "gGdsVfPmRpuSfD4rCdzblQ",
    operationName: "CellModel::getConfig Method Filter",
    operationDescription: "Provides the CellModel::getConfig method implementation.",

    inputFilterSpec: {
        ____label: "CellModel::getArtifact Method Request",
        ____description: "Request object passed to method CellModel::getArtifact to retrieve a specific registered CellModel, APM, ACT, or TOP ES6 class instance reference.",
        ____types: "jsObject",
        ____defaultValue: {},
        CellModelInstance: { ____opaque: true }, // Reference to the calling CM instance's this provided by CellModel::getArtifactMethod
        id: {
            ____label: "Artifact IRUT ID",
            ____description: "The IRUT ID of the artifact to retrieve. Typically this API is not used by derived software; it's a very low-level facility.",
            ____accept: [
                "jsUndefined", // If not specified then getArtifact will attempt to resolve your query against this CellModel's definition
                "jsString" // If specified, then getArtifact will attempt to resolve your query against the the specified sub-CellModel's definition
            ]
        },
        type: {
            ____label: "Artifact Type",
            ____description: "An assertion about the type of artifact associated with id. If the actual artifact specified by id does not match type then the query will fail.",
            ____accept: "jsString",
            ____inValueSet: [
                "CM", // CellModel
                "CMAT", // CellModel Artifact Tree (report object generated from CellModel data).
                "APM", // AbstractProcessModel
                "TOP", // TransitionOperator
                "ACT", // ControllerAction (TODO: Should be CellAction)
            ],
            ____defaultValue: "CM"
        }
    },

    outputFilterSpec: {
        ____opaque: true // TODO: Lock this down
    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const cellModel = request_.CellModelInstance;
            if (!cellModel.isValid()) {
                errors.push(cellModel.toJSON());
                break;
            }
            let innerResponse = cellModel.getArtifact({ id: request_.id, type: "CM" });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const artifact = innerResponse.result;

            switch (request_.type) {
            case "CM":
                response.result = {};
                let innerResponse = cellModel.getCMConfig({ type: "APM" });
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }
                response.result.apm = innerResponse.result;
                innerResponse = cellModel.getCMConfig({ type: "TOP" });
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }
                response.result.top = innerResponse.result;
                innerResponse = cellModel.getCMConfig({ type: "ACT" });
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }
                response.result.act = innerResponse.result;
                break;
            case "CMAT":
                let context = { refStack: [], result: {} };
                arccore.graph.directed.depthFirstTraverse({
                    digraph: artifact._private.digraph,
                    context: context,
                    options: { startVector: [ "INDEX_CM" ] },
                    visitor: {
                        getEdgeWeight: (request_) => {
                            let props = request_.g.getVertexProperty(request_.e.u);
                            let edgeWeight = null;
                            switch (props.type) {
                            case "INDEX":
                                edgeWeight = "INDEX";
                                break;
                            case "APM":
                                edgeWeight = `0_${props.artifact.getName()}`;
                                break;
                            case "TOP":
                                edgeWeight = `1_${props.artifact.getName()}`;
                                break;
                            case "ACT":
                                edgeWeight = `2_${props.artifact.getName()}`;
                                break;
                            case "CM":
                                let artifact = props.artifact?props.artifact:cellModel;
                                edgeWeight = `3_${artifact.getName()}`;
                                break;
                            }
                            return edgeWeight;
                        },
                        compareEdgeWeights: (request_) => {
                            return (request_.a < request_.b)?-1:(request_.a > request_.b)?1:0;
                        },
                        discoverVertex: (request_) => {
                            if (!request_.context.refStack.length) {
                                request_.context.refStack.push(request_.context.result);
                            }
                            let descriptor = request_.context.refStack[request_.context.refStack.length - 1][request_.u] = {};
                            const props = request_.g.getVertexProperty(request_.u);
                            switch (props.type) {
                            case "INDEX":
                                descriptor.type = props.type;
                                break;
                            default:
                                let artifact = props.artifact?props.artifact:cellModel;
                                descriptor.id = artifact.getID();
                                descriptor.vdid = artifact.getVDID();
                                descriptor.name = artifact.getName();
                                descriptor.description = artifact.getDescription();
                                descriptor.type = props.type;
                                break;
                            }
                            request_.context.refStack.push(descriptor);
                            return true;
                        },
                        finishVertex: (request_) => {
                            request_.context.refStack.pop();
                            return true;
                        }
                    }
                });
                response.result = context.result;
                break;
            case "APM":
            case "TOP":
            case "ACT":
                response.result = artifact._private.digraph.outEdges(`INDEX_${request_.type}`)
                    .map((edge_) => { return artifact._private.digraph.getVertexProperty(edge_.v).artifact; })
                    .sort((a_, b_) => { (a_.getName() < b_.getName())?-1:(a_.getName() > b_.getName())?1:0; });

                break;
            default:
                errors.push(`Value of '${request_.type}' specified for ~.type is invalid. Must be undefined, CM, APM, TOP, or ACT.`);
                break;
            }

            break;
        }
        if (errors.length) {
            errors.unshift("CellModel::getCMConfigAPM method error:");
            response.error = errors.join(" ");
        }

        return response;

    }

});
if (factoryResponse.error) {
    throw new Error(factoryRespnse.error);
}

module.exports = factoryResponse.result;
