// cpm-get-cell-process-descriptor.js

const arccore = require("@encapsule/arccore");
const cellProcessQueryResponseDescriptorSpec = require("./iospecs/cell-process-query-response-descriptor-spec");
const cellProcessQueryRequestFilterBySpec = require("./iospecs/cell-process-query-request-filterby-spec");
const cpmMountingNamespaceName = require("../../../filters/cpm-mounting-namespace-name");
const cpmPath = `~.${cpmMountingNamespaceName}`;

const factoryResponse = arccore.filter.create({
    operationID: "CxS4tmxfRdSF6C7pljlm5Q",
    operationName: "cpmLib: Get Cell Process Descriptor",
    operationDescription: "Returns the cell process descriptor of the specified cell process.",
    inputFilterSpec: {
        ____types: "jsObject",
        cellProcessID: { ____accept: "jsString" },
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
            if (!request_.treeData.digraph.isVertex(request_.cellProcessID)) {
                errors.push(`Invalid cellProcessID specified. No active cell process with ID '${request_.cellProcessID}'.`);
                break;
            }
            const cellProcessProps = request_.treeData.digraph.getVertexProperty(request_.cellProcessID);
            const queryPath = (cellProcessProps.apmBindingPath !== "~")?cellProcessProps.apmBindingPath:cpmPath;
            const ocdResponse = request_.ocdi.getNamespaceSpec(queryPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const apmBindingID = ocdResponse.result.____appdsl.apm;
            response.result = {
                cellProcessID: request_.cellProcessID,
                apmBindingPath: cellProcessProps.apmBindingPath,
                apmID: apmBindingID
            };
            break;
        }
        if (errors.length) {
            repsonse.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.result);
}

module.exports = factoryResponse.result;

