// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-query.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const cpmLib = require("./lib");

const cellProcessQueryResponseDescriptorSpec = require("./lib/iospecs/cell-process-query-response-descriptor-spec");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

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
                        filterBy: cellProcessQueryRequestFilterBySpec,
                        // TODO: This isn't necessary at all right? actOn should alleviate the need for this entirely no?
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
                            cellProcessCoordinates: {
                                ____types: [ "jsUndefined", "jsObject" ],
                                apmID: { ____accept: "jsString" },
                                instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
                            }
                        },
                        resultSets: {
                            ____types: "jsObject",
                            ____defaultValue: { parent: true, ancestors: true, children: true, descendants: true },
                            parent: { ____accept: "jsBoolean", ____defaultValue: false },
                            ancestors: { ____accept: "jsBoolean", ____defaultValue: false },
                            children: { ____accept: "jsBoolean", ____defaultValue: false },
                            descendants: { ____accept: "jsBoolean", ____defaultValue: false }
                        },
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
            apmID: { ____accept: "jsString" },
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
            ...cellProcessQueryResponseDescriptorSpec
        },
        ancestors: {
            ____label: "Ancestor Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' parent, it's parent...",
            ____types: [ "jsUndefined", "jsArray" ],
            cellProcessDescriptor: cellProcessQueryResponseDescriptorSpec
        },
        children: {
            ____label: "Child Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' child processes.",
            ____types: [ "jsUndefined", "jsArray" ],
            childProcessDescriptor: cellProcessQueryResponseDescriptorSpec
        },
        descendants: {
            ____label: "Descendant Cell Processes",
            ____description: "An array of cell process ID and apmBindingPath descriptor objects that include the queried cell process' children, their children...",
            ____types: [ "jsUndefined", "jsArray" ],
            descendantProcessDescriptor: cellProcessQueryResponseDescriptorSpec
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

                if (!message.queryCellProcess.cellProcessID && !message.queryCellProcess.apmBindingPath && !message.queryCellProcess.cellProcessCoordinates) {
                    errors.push("Invalid cell process query request. If you explicitly set queryCellProcess then you must specify cellProcessID. Or either apmBindingPath or cellProcessCoordinates so that cellProcessID can be calculated.");
                    break;
                }

                cellProcessID = message.queryCellProcesscellProcessID?message.queryCellProcess.cellProcessID:message.queryCellProcess.apmBindingPath?arccore.identifier.irut.fromReference(message.queryCellProcess.apmBindingPath).result:
                arccore.identifier.irut.fromReference(`~.${message.queryCellProcess.cellProcessCoordinates.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.queryCellProcess.cellProcessCoordinates.instanceName).result}`).result;

            } else {
                cellProcessID = arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result;
            }

            // Get a reference to the Cell Process Manager's process tree descriptor object.
            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const cellProcessTreeData = cpmDataDescriptor.data.ownedCellProcesses;

            // Get a reference to this cell process' descriptor.
            cpmLibResponse = cpmLib.getProcessDescriptor.request({ cellProcessID, ocdi: request_.context.ocdi, treeData: cellProcessTreeData });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cellProcessDescriptor = cpmLibResponse.result;

            response.result = {
                query: {
                    ...cellProcessDescriptor,
                    resultSets: message.resultSets
                }
            };

            if (message.resultSets.parent) {
                cpmLibResponse = cpmLib.getProcessParentDescriptor.request({
                    cellProcessID,
                    filterBy: message.filterBy,
                    ocdi: request_.context.ocdi,
                    treeData: cellProcessTreeData
                });
                if (cpmLibResponse.error) {
                    errors.push(cpmLibResponse.error);
                    break;
                }
                response.result.parent = cpmLibResponse.result;
            }

            // anscestors; parent and it's parent...
            if (message.resultSets.ancestors) {
                cpmLibResponse = cpmLib.getProcessAncestorDescriptors.request({
                    cellProcessID,
                    filterBy: message.filterBy,
                    ocdi: request_.context.ocdi,
                    treeData: cellProcessTreeData
                });
                if (cpmLibResponse.error) {
                    errors.push(cpmLibResponse.error);
                    break;
                }
                response.result.ancestors = cpmLibResponse.result;
            }

            // children
            if (message.resultSets.children) {
                cpmLibResponse = cpmLib.getProcessChildrenDescriptors.request({
                    cellProcessID,
                    filterBy: message.filterBy,
                    ocdi: request_.context.ocdi,
                    treeData: cellProcessTreeData
                });
                if (cpmLibResponse.error) {
                    errors.push(cpmLibResponse.error);
                    break;
                }
                response.result.children = cpmLibResponse.result;
            }

            // descendants; children and their children...
            if (message.resultSets.descendants) {
                cpmLibResponse = cpmLib.getProcessDescendantDescriptors.request({
                    cellProcessID,
                    filterBy: message.filterBy,
                    ocdi: request_.context.ocdi,
                    treeData: cellProcessTreeData
                });
                if (cpmLibResponse.error) {
                    errors.push(cpmLibResponse.error);
                    break;
                }
                response.result.descendants = cpmLibResponse.result;
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

