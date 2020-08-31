// cpm-get-cell-process-ancestor-descriptors.js

const arccore = require("@encapsule/arccore");

const cellProcessQueryResponseDescriptorSpec = require("./iospecs/cell-process-query-response-descriptor-spec");

const cpmMountingNamespaceName = require("../../../filters/cpm-mounting-namespace-name");
const cpmPath = `~.${cpmMountingNamespaceName}`;

const factoryResponse = arccore.filter.create({
    operationID: "IAokn6EeTcug9ZZH2iqgvw",
    operationName: "cpmlib: Get Cell Process Ancestor Descriptors",
    operationDescription: "Generates an array of cell process descriptor objects describing the ancestor cell process(es) of the specified cell process.",

    inputFilterSpec: {
        ____types: "jsObject",
        cellProcessID: { ____accept: "jsString" },
        filterBy: {
            ____types: [ "jsUndefined", "jsObject" ],
            apmIDs: {
                ____types: [ "jsString", "jsArray" ],
                apmID: { ____accept: "jsString" }
            }
        },
        ocdi: { ____accept: "jsObject" },
        treeData: { ____accept: "jsObject" }
    },

    outputFilterSpec: {
        ____types: "jsArray",
        ____defaultValue: [],
        cellProcessDescriptor: cellProcessQueryResponseDescriptorSpec
    },

    bodyFunction: function(request_) {
        let response = { error: null, result: [] };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let ancestorCellProcessID = request_.cellProcessID;
            while (request_.treeData.digraph.inDegree(ancestorCellProcessID)) {
                ancestorCellProcessID = request_.treeData.digraph.inEdges(ancestorCellProcessID)[0].u;
                const ancestorCellProcessProps = request_.treeData.digraph.getVertexProperty(ancestorCellProcessID);
                const queryPath = (ancestorCellProcessProps.apmBindingPath !== "~")?ancestorCellProcessProps.apmBindingPath:cpmPath;
                const ocdResponse = request_.ocdi.getNamespaceSpec(queryPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmBindingID = ocdResponse.result.____appdsl.apm;
                if (!request_.filterBy) {
                    response.result.push({ cellProcessID: ancestorCellProcessID, apmBindingPath: ancestorCellProcessProps.apmBindingPath, apmID: apmBindingID });
                } else {
                    let apmIDs = (!Array.isArray(request_.filterBy.apmIDs))?[ request_.filterBy.apmIDs ]:request_.filterBy.apmIDs;
                    if (!apmIDs.length) {
                        errors.push("Invalid filterBy specifies no APM ID's.");
                        break;
                    }
                    const indexOfID = apmIDs.indexOf(apmBindingID);
                    if (indexOfID >= 0) {
                        response.result.push({ cellProcessID: ancestorCellProcessID, apmBindingPath: ancestorCellProcessProps.apmBindingPath, apmID: apmBindingID });
                    }
                }
            }
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
