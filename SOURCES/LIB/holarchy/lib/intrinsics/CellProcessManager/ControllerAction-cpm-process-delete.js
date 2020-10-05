// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-delete.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");
const cpmLib = require("./lib");
const cppLib = require("../CellProcessProxy/lib");

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
                            cellProcessUniqueName: { ____accept: "jsString", ____defaultValue: "singleton" }
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
    // request_.context.apmBindingPath at all!
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
            console.log(`[${this.operationID}::${this.operationName}] action start...`);

            // Dereference the body of the action request.
            const message = request_.actionRequest.holarchy.CellProcessor.process.delete;

            if (!message.cellProcessID && !message.apmBindingPath && !message.cellProcessNamespace) {
                errors.push("You need to specify cellProcessID. Or eiter apmBindingPath or cellProcessNamespace so that cellProcessID can be calculated.");
                break;
            }

            // TODO: This should be converted to a cpmLib call
            let cellProcessID = message.cellProcessID?message.cellProcessID:
                message.apmBindingPath?arccore.identifier.irut.fromReference(message.apmBindingPath).result:
                arccore.identifier.irut.fromReference(`~.${message.cellProcessNamespace.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.cellProcessNamespace.cellProcessUniqueName).result}`).result;

            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;

            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;
            const sharedCellProcessesData = cpmDataDescriptor.data.sharedCellProcesses;

            const inDegree = ownedCellProcessesData.digraph.inDegree(cellProcessID);

            switch (inDegree) {
            case -1:
                errors.push(`Invalid cell process apmBindingPath or cellProcessID specified in cell process delete. No such cell process ID '${cellProcessID}'.`);
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

            if (sharedCellProcessesData.digraph.isVertex(cellProcessID)) {
                if (sharedCellProcessesData.digraph.getVertexProperty(cellProcessID).role === "shared") {
                    errors.push(`Invalid cell process apmBindingPath or cellProcess ID specified in cell process delete. Cell process ID '${cellProcessID}' is a shared process that cannot be deleted w/Cell Process Manager process delete.`);
                    break;
                }
            }

            const parentProcessID = ownedCellProcessesData.digraph.inEdges(cellProcessID)[0].u;

            let processesToDelete = [];

            let digraphTraversalResponse = arccore.graph.directed.depthFirstTraverse({
                digraph: ownedCellProcessesData.digraph,
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

            let cellProcessRemoveIDs = [];
            for (let i = 0 ; processesToDelete.length > i ; i++) {

                const cellID = processesToDelete[i];
                const cellDescriptor = ownedCellProcessesData.digraph.getVertexProperty(cellID);
                if (cellDescriptor.role === "cell-process") {
                    cellProcessRemoveIDs.push(cellID);
                    const apmBindingPath = cellDescriptor.apmBindingPath;
                    const apmBindingPathTokens = apmBindingPath.split(".");
                    const apmProcessesNamespace = apmBindingPathTokens.slice(0, apmBindingPathTokens.length - 1).join(".");
                    const apmProcessesRevisionNamespace = [ ...apmBindingPathTokens.slice(0, apmBindingPathTokens.length - 2), "revision" ].join(".");

                    // TODO: ObservableControllerData should abstract all common array and map type operations.
                    // DELETE CELL PROCESS FROM ObservableControllerData.
                    // You see... This is a horrible pattern. There are simpler way available even w/current OCD.
                    // But, there's a reason why I insist on using writeNamespace even here. And, why we 100% need OCD to support containers natively.

                    // Read the array...
                    let ocdResponse = request_.context.ocdi.readNamespace(apmProcessesNamespace);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }
                    let processesMemory = ocdResponse.result;

                    // Delete the element (this is the cell process)...
                    delete processesMemory[apmBindingPathTokens[apmBindingPathTokens.length - 1]];

                    // Write the entire array back into OCD (removing the cell process from OCD).
                    ocdResponse = request_.context.ocdi.writeNamespace(apmProcessesNamespace, processesMemory);
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error)
                        break;
                    }

                    // There's no reason why OCD cannot also support an efficient namespace increment operator.
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
                }

                ownedCellProcessesData.digraph.removeVertex(cellID);

            }
            if (errors.length) {
                break;
            }

            let ocdResponse = request_.context.ocdi.writeNamespace(`${cpmDataDescriptor.path}.ownedCellProcesses.revision`, ownedCellProcessesData.revision + 1);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            let cppLibResponse = cppLib.removeOwnedProcesses.request({ cpmData: cpmDataDescriptor.data, deletedOwnedCellProcesses: processesToDelete });
            if (cppLibResponse.error) {
                errors.push(cppResponse.error);
                break;
            }

            if (cppLibResponse.result.runGarbageCollector) {
                cppLibResponse = cppLib.collectGarbage.request({ act: request_.context.act, cpmData: cpmDataDescriptor.data, ocdi: request_.context.ocdi });
                if (cppLibResponse.error) {
                    errors.push(cppResponse.error);
                    break;
                }
                ocdResponse = request_.context.ocdi.writeNamespace(`${cpmDataDescriptor.path}.sharedCellProcesses.revision`, sharedCellProcessesData.revision + 1);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
            }

            response.result = {
                apmBindingPath: ownedCellProcessesData.digraph.getVertexProperty(parentProcessID).apmBindingPath,
                cellProcessID: parentProcessID
            };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        console.log(`[${this.operationID}::${this.operationName}] action completed w/status '${response.error?"ERROR":"SUCCESS"}'.`);
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

