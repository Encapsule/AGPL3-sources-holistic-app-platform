// cpm-get-cell-process-descendant-descriptors.js

const arccore = require("@encapsule/arccore");
const cellProcessQueryResponseDescriptorSpec = require("./iospecs/cell-process-query-response-descriptor-spec");
const cellProcessQueryRequestFilterBySpec = require("./iospecs/cell-process-query-request-filterby-spec");

const factoryResponse = arccore.filter.create({
    operationID: "roU4m7MkR_yj1hvoOFbvAA",
    operationName: "cpmLib: Get Cell Process Descendant Descriptors",
    operationDescription: "Returns an array of process descriptor objects describing the descendant process(es) of the querying cell process.",

    inputFilterSpec: {
        ____types: "jsObject",
        cellProcessID: { ____accept: "jsString" },
        filterBy: cellProcessQueryRequestFilterBySpec,
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
            const digraphTraversalResponse = arccore.graph.directed.breadthFirstTraverse({
                digraph: request_.treeData.digraph,
                options: { startVector: [ request_.cellProcessID ] },
                visitor: {
                    discoverVertex: function(visitorRequest_) {
                        if (visitorRequest_.u === request_.cellProcessID) {
                            // exclude the query cell process
                            return true;
                        }
                        const descendantCellProcessID = visitorRequest_.u;
                        const descendantCellProcessProps = visitorRequest_.g.getVertexProperty(descendantCellProcessID);
                        const ocdResponse = request_.ocdi.getNamespaceSpec(descendantCellProcessProps.apmBindingPath);
                        if (ocdResponse.error) {
                            errors.push(opdResponse.error);
                            return false; // abort the BF search
                        }
                        const apmBindingID = ocdResponse.result.____appdsl.apm;
                        if (!request_.filterBy) {
                            response.result.push({ cellProcessID: descendantCellProcessID, apmBindingPath: descendantCellProcessProps.apmBindingPath, apmID: apmBindingID });
                        } else {
                            let apmIDs = (!Array.isArray(request_.filterBy.apmIDs))?[ request_.filterBy.apmIDs ]:request_.filterBy.apmIDs;
                            if (!apmIDs.length) {
                                errors.push("Invalid filterBy specifies no APM ID's.");
                                return false; // abort the BF search
                            }
                            const indexOfID = apmIDs.indexOf(apmBindingID);
                            if (indexOfID > 0) {
                                response.result.push({ cellProcessID: descendantCellProcessID, apmBindingPath: descendantCellProcessProps.apmBindingPath, apmID: apmBindingID });
                            }
                        }
                        return true;
                    }
                }
            });
            if (digraphTraversalResponse.error) {
                errors.push(digraphTraversalResponse.error);
                break;
            }
            if (digraphTraversalResponse.result.searchStatus !== "completed") {
                errors.unshift(`Internal validation error performing breadth-first visit of cell process digraph from cellProcessID = '${cellProcessID}'. Search did not complete?!`);
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

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
