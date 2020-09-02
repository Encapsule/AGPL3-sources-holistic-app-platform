// cpm-get-cell-process-parent-descriptor.js

const arccore = require("@encapsule/arccore");
const cellProcessQueryResponseDescriptorSpec = require("./iospecs/cell-process-query-response-descriptor-spec");
const cellProcessQueryRequestFilterBySpec = require("./iospecs/cell-process-query-request-filterby-spec");
const cpmMountingNamespaceName = require("../../../filters/cpm-mounting-namespace-name");
const cpmPath = `~.${cpmMountingNamespaceName}`;

const factoryResponse = arccore.filter.create({
    operationID: "f3Q_0uCcRs-hNx25ekTK4w",
    operationName: "cpmLib: Get Cell Process Parent Descriptor",
    operationDescription: "Returns a process descriptor object describing the parent cell process of the querying cell process.",

    inputFilterSpec: {
        ____types: "jsObject",
        cellProcessID: { ____accept: "jsString" },
        filterBy: cellProcessQueryRequestFilterBySpec,
        ocdi: { ____accept: "jsObject" },
        treeData: { ____accept: "jsObject" }
    },

    outputFilterSpec: cellProcessQueryResponseDescriptorSpec,

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            switch (request_.treeData.digraph.inDegree(request_.cellProcessID)) {
            case -1:
                errors.push(`Invalid cellProcessID specified. No active cell process with ID '${request_.cellProcessID}'.`);
                break;
            case 0:
                // Take all response.result default values (all null's).
                break;
            case 1:
                const parentCellProcessID = request_.treeData.digraph.inEdges(request_.cellProcessID)[0].u;
                const parentCellProcessProps = request_.treeData.digraph.getVertexProperty(parentCellProcessID);

                const queryPath = (parentCellProcessProps.apmBindingPath !== "~")?parentCellProcessProps.apmBindingPath:cpmPath;
                const ocdResponse = request_.ocdi.getNamespaceSpec(queryPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmBindingID = ocdResponse.result.____appdsl.apm;
                if (!request_.filterBy) {
                    response.result = { cellProcessID: parentCellProcessID, apmBindingPath: parentCellProcessProps.apmBindingPath, apmID: apmBindingID };
                } else {
                    let apmIDs = (!Array.isArray(request_.filterBy.apmIDs))?[ request_.filterBy.apmIDs ]:request_.filterBy.apmIDs;
                    if (!apmIDs.length) {
                        errors.push("Invalid filterBy specifies no APM ID's.");
                    } else {
                        const indexOfID = apmIDs.indexOf(apmBindingID);
                        if (indexOfID >= 0) {
                            response.result = { cellProcessID: parentCellProcessID, apmBindingPath: parentCellProcessProps.apmBindingPath, apmID: apmBindingID };
                        }
                    } // else
                } // else
                break;
            default:
                errors.push("Internal error: Unexpected inDegree!");
                break;
            } // switch
            break;
        } // while
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

