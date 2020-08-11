// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-delete.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

const controllerAction = new ControllerAction({
    id: "4s_DUfKnQ4aS-xRjewAfUQ",
    name: "Cell Process Manager: Process Delete",
    description: "Requests that the Cell Process Manager delete a branch of the cell process tree.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    delete: {
                        ____types: "jsObject",
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
    },

    actionResultSpec: {
        ____types: "jsObject",
        apmBindingPath: { ____accept: "jsString" }, // this is the OCD path of deleted process' parent process
        cellProcessID: { ____accept: "jsString" } // this is an IRUT-format hash of parent process' apmBindingPath
    },

    // NOTE: Unlike most ControllerAction bodyFunctions, process delete action DOES NOT consider
    // request_.apmBindingPath at all!
    //
    // The process namespace of the cell process to delete is determined from the cell process tree digraph
    // using cellProcessID that is either specified directly. Or, that is calculated from from apmBindingPath
    // or cellProcessNamespace.

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process delete...");

            // Dereference the body of the action request.
            const message = request_.actionRequest.holarchy.CellProcessor.process.delete;

            if (!message.cellProcessID && !message.apmBindingPath && !message.cellProcessNamespace) {
                errors.push("You need to specify cellProcessID. Or eiter apmBindingPath or cellProcessNamespace so that cellProcessID can be calculated.");
                break;
            }

            let cellProcessID = message.cellProcessID?message.cellProcessID:
                message.apmBindingPath?arccore.identifier.irut.fromReference(message.apmBindingPath).result:
                arccore.identifier.irut.fromReference(`~.${message.cellProcessNamespace.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.cellProcessNamespace.cellProcessUniqueName).result}`).result;

            // Now we have to dereference the cell process manager's process digraph (always a single-rooted tree).
            const cellProcessTreePath = `~.${cpmMountingNamespaceName}.cellProcessTree`;

            let ocdResponse = request_.context.ocdi.readNamespace(cellProcessTreePath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const cellProcessTreeData = ocdResponse.result;

            const inDegree = cellProcessTreeData.digraph.inDegree(cellProcessID);

            switch (inDegree) {
            case -1:
                errors.push(`Invalid cell process apmBindingPath or cellProcessID specified in cell process delete. No such cell process '${cellProcessID}'.`);
                break;
            case 0:
                errors.push("You cannot delete the root cell process manager process using this mechanism! Delete the CellProcessor instance if that's what you really want to do.");
                break;
            case 1:
                // As expected...
                break;
            default:
                errors.push(`Internal validation error inspecting the cell process digraph model. '${cellProcessID}' has inDegree === ${inDegree}? That should not be possible!`);
                break;
            }
            if (errors.length) {
                break;
            }

            const parentProcessID = cellProcessTreeData.digraph.inEdges(cellProcessID)[0].u;

            let processesToDelete = [];

            let digraphTraversalResponse = arccore.graph.directed.breadthFirstTraverse({
                digraph: cellProcessTreeData.digraph,
                options: { startVector: [ cellProcessID ] },
                visitor: {
                    finishVertex: function(request_) {
                        processesToDelete.push(request_.u);
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

            for (let i = 0 ; processesToDelete.length > i ; i++) {

                const cellProcessID = processesToDelete[i];
                const processDescriptor = cellProcessTreeData.digraph.getVertexProperty(cellProcessID);
                const apmBindingPath = processDescriptor.apmBindingPath;
                const apmBindingPathTokens = apmBindingPath.split(".");
                const apmProcessesNamespace = apmBindingPathTokens.slice(0, apmBindingPathTokens.length - 1).join(".");
                const apmProcessesRevisionNamespace = [ ...apmBindingPathTokens.slice(0, apmBindingPathTokens.length - 2), "revision" ].join(".");
                ocdResponse = request_.context.ocdi.readNamespace(apmProcessesNamespace);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                let processesMemory = ocdResponse.result;
                delete processesMemory[apmBindingPathTokens[apmBindingPathTokens.length - 1]];
                ocdResponse = request_.context.ocdi.writeNamespace(apmProcessesNamespace, processesMemory);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error)
                    break;
                }
                ocdResponse = request_.context.ocdi.readNamespace(apmProcessesRevisionNamespace);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmProcessesRevision = ocdResponse.result;
                ocdResponse = request_.context.ocdi.writeNamespace(apmProcessesRevisionNamespace, apmProcessesRevision + 1);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                cellProcessTreeData.digraph.removeVertex(cellProcessID);

            }
            if (errors.length) {
                break;
            }


            ocdResponse = request_.context.ocdi.writeNamespace(`${cellProcessTreePath}.revision`, cellProcessTreeData.revision + 1);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            response.result = {
                apmBindingPath: cellProcessTreeData.digraph.getVertexProperty(parentProcessID).apmBindingPath,
                cellProcessID: parentProcessID
            };

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

