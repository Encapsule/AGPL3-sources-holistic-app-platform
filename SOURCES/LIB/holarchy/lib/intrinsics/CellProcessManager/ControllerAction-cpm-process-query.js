// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-query.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

const controllerAction = new ControllerAction({
    id: "r-JgxABoS_a-mSE2c1nvKA",
    name: "Cell Process Manager: Process Query",
    description: "Performs a query on a specific cell process managed by the Cell Process Manager.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    query: {
                        ____types: "jsObject",
                        resultSets: {
                            ____types: "jsObject",
                            ____defaultValue: { parent: true, ancestors: true, children: true, descendants: true },
                            parent: { ____accept: "jsBoolean", ____defaultValue: false },
                            ancestors: { ____accept: "jsBoolean", ____defaultValue: false },
                            children: { ____accept: "jsBoolean", ____defaultValue: false },
                            descendants: { ____accept: "jsBoolean", ____defaultValue: false }
                        },
                        queryCellProcess: {
                            ____label: "Query Cell Process Override",
                            ____description: "Allows the caller to optionally override that default action behavior to specify the cell process ID to query.",
                            // If queryCellProcess object is ommitted, then we deduce the cell process ID from the controller action's outer apmBindingPath.
                            ____types: [ "jsUndefined", "jsObject" ],
                            // Either of
                            cellProcessID: { ____accept: [ "jsUndefined", "jsString" ] }, // Preferred
                            // ... or
                            apmBindingPath: { ____accept: [ "jsUndefined", "jsString" ] }, // Equivalent, but less efficient
                            // ... or
                            cellProcessNamespace: {
                                ____types: [ "jsUndefined", "jsObject" ],
                                apmID: { ____accept: "jsString" },
                                cellProcessUniqueName: { ____accept: [ "jsUndefined", "jsString" ] }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____label: "Query Cell Process Action Result",
        ____description: "A descriptor object returned by act call to Cell Process Manager cell process query via response.result.actionResult.",
        ____types: "jsObject",
        query: {
            ____label: "Query Cell Process",
            ____description: "The cell process ID and apmBindingPath of the queried cell process.",
            ____types: "jsObject",
            cellProcessID: { ____accept: "jsString" },
            apmBindingPath: { ____accept: "jsString" },
            resultSets: {
                ____types: "jsObject",
                parent: { ____accept: "jsBoolean" },
                ancestors: { ____accept: "jsBoolean" },
                children: { ____accept: "jsBoolean" },
                descendants: { ____accept: "jsBoolean" }
            }
        },
        parent: {
            ____label: "Parent Cell Process",
            ____description: "The cell process ID and apmBindingPath of the queried cell process' parent cell process.",
            ____types: [ "jsUndefined", "jsObject" ],
            cellProcessID: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null },
            apmBindingPath: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null }
        },
        ancestors: {
            ____label: "Ancestor Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' parent, it's parent...",
            ____types: [ "jsUndefined", "jsArray" ],
            element: {
                ____label: "Ancestor Cell Process",
                ____description: "The cell process ID and apmBindingPath of one of the queried cell process' ancestor cell process.",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        },
        children: {
            ____label: "Child Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' child processes.",
            ____types: [ "jsUndefined", "jsArray" ],
            element: {
                ____label: "Child Cell Process",
                ____description: "The cell process ID and apmBindingPath of one of the queried cell process' child cell process(es).",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        },
        descendants: {
            ____label: "Descendant Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' children, their children...",
            ____types: [ "jsUndefined", "jsArray" ],
            element: {
                ____label: "Descendant Cell Process",
                ____description: "The cell process ID and apmBindingPath of one of the queried cell process' descendant cell process(es).",
                ____types: "jsObject",
                cellProcessID: { ____accept: "jsString" },
                apmBindingPath: { ____accept: "jsString" }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process query...");

            const message = request_.actionRequest.holarchy.CellProcessor.process.query;

            if (!message.resultSets.parent && !message.resultSets.ancestors && !message.resultSets.children && !message.resultSets.descendants ) {
                errors.push("Invalid cell process query request. If you explicitly set resultSets flags then you must set at least one result set Boolean flag.");
                break;
            }

            let cellProcessID = null;

            if (message.queryCellProcess) {

                if (!message.queryCellProcess.cellProcessID && !message.queryCellProcess.apmBindingPath && !message.queryCellProcess.cellProcessNamespace) {
                    errors.push("Invalid cell process query request. If you explicitly set queryCellProcess then you must specify cellProcessID. Or either apmBindingPath or cellProcessNamespace so that cellProcessID can be calculated.");
                    break;
                }

                cellProcessID = message.queryCellProcesscellProcessID?message.queryCellProcess.cellProcessID:
                    message.queryCellProcess.apmBindingPath?arccore.identifier.irut.fromReference(message.queryCellProcess.apmBindingPath).result:
                    arccore.identifier.irut.fromReference(`~.${message.queryCellProcess.cellProcessNamespace.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.queryCellProcess.cellProcessNamespace.cellProcessUniqueName).result}`).result;

            } else {
                cellProcessID = arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result;
            }

            // Now we have to dereference the cell process manager's process digraph (always a single-rooted tree).
            const cellProcessTreePath = `~.${cpmMountingNamespaceName}.cellProcessTree`;

            let ocdResponse = request_.context.ocdi.readNamespace(cellProcessTreePath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const cellProcessTreeData = ocdResponse.result;

            if (!cellProcessTreeData.digraph.isVertex(cellProcessID)) {
                errors.push(`Invalid cell process apmBindingPath or cellProcessID specified in cell process query. No such cell process '${cellProcessID}'.`);
                break;
            }

            const cellProcessProps = cellProcessTreeData.digraph.getVertexProperty(cellProcessID);

            response.result = {
                query: {
                    cellProcessID,
                    apmBindingPath: cellProcessProps.apmBindingPath,
                    resultSets: message.resultSets
                }
            };

            if (message.resultSets.parent) {
                const cellProcessInDegree = cellProcessTreeData.digraph.inDegree(cellProcessID);
                if (!cellProcessInDegree) {
                    response.result.parent = {};
                } else {
                    const parentCellProcessID = cellProcessTreeData.digraph.inEdges(cellProcessID)[0].u;
                    const parentCellProcessProps = cellProcessTreeData.digraph.getVertexProperty(parentCellProcessID);
                    response.result.parent = {
                        apmBindingPath: parentCellProcessProps.apmBindingPath,
                        cellProcessID: parentCellProcessID
                    }
                }
            }

            // parent and it's parent...
            if (message.resultSets.ancestors) {
                response.result.ancestors = [];
                let currentCellProcessID = cellProcessID;
                while (cellProcessTreeData.digraph.inDegree(currentCellProcessID)) {
                    currentCellProcessID = cellProcessTreeData.digraph.inEdges(currentCellProcessID)[0].u;
                    const currentCellProcessProperties = cellProcessTreeData.digraph.getVertexProperty(currentCellProcessID);
                    response.result.ancestors.push({ cellProcessID: currentCellProcessID, apmBindingPath: currentCellProcessProperties.apmBindingPath });
                }
            }

            // children
            if (message.resultSets.children) {
                response.result.children = [];
                const outEdges = cellProcessTreeData.digraph.outEdges(cellProcessID);
                for (let index in outEdges) {
                    const childCellProcessID = outEdges[index].v;
                    const childCellProcessProperties = cellProcessTreeData.digraph.getVertexProperty(childCellProcessID);
                    response.result.children.push({ cellProcessID: childCellProcessID, apmBindingPath: childCellProcessProperties.apmBindingPath });
                }
            }

            // descendants
            if (message.resultSets.descendants) {
                response.result.descendants = [];
                const digraphTraversalResponse = arccore.graph.directed.breadthFirstTraverse({
                    digraph: cellProcessTreeData.digraph,
                    options: { startVector: [ cellProcessID ] },
                    visitor: {
                        discoverVertex: function(visitorRequest_) {
                            if (visitorRequest_.u === cellProcessID) {
                                // exclude the query cell process
                                return true;
                            }
                            const descendantCellProcessID = visitorRequest_.u;
                            const descendantCellProcessProperties = visitorRequest_.g.getVertexProperty(descendantCellProcessID);
                            response.result.descendants.push({ cellProcessID: descendantCellProcessID, apmBindingPath: descendantCellProcessProperties.apmBindingPath });
                            return true;
                        }
                    }
                });
                if (digraphTraversalResponse.error) {
                    errors.push(digraphTraversalResponse.error);
                    break;
                }

                if (digraphTraversalResponse.result.searchStatus !== "completed") {
                    errors.push(`Internal validation error performing breadth-first visit of cell process digraph from cellProcessID = '${cellProcessID}'. Search did not complete?!`);
                    break;
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

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

