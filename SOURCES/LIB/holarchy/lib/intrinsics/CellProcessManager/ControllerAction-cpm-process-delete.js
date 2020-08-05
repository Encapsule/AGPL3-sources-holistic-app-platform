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
                        // Either...
                        apmBindingPath: { ____accept: [ "jsUndefined", "jsString" ] },
                        // ... or
                        cellProcessID: { ____accept: [ "jsUndefined", "jsString" ] }
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

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process delete...");

            // Dereference the body of the action request.
            const message = request_.actionRequest.holarchy.CellProcessor.process.delete;

            if (!message.apmBindingPath && !message.cellProcessID) {
                errors.push("You need to specify either the apmBindingPath or the cellProcessID of the cell process to delete.");
                break;
            }

            let cellProcessID = message.cellProcessID?message.cellProcessID:arccore.identifier.irut.fromReference(message.apmBindingPath).result;

            // Now we have to dereference the cell process manager's process digraph (always a single-rooted tree).
            const cellProcessDigraphPath = `~.${cpmMountingNamespaceName}.cellProcessDigraph`;

            let ocdResponse = request_.context.ocdi.readNamespace(cellProcessDigraphPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const processDigraph = ocdResponse.result;

            if (!processDigraph.runtime.isVertex(cellProcessID)) {
                errors.push(`Invalid cell process apmBindingPath or cellProcessID specified in cell process delete. No such cell process '${cellProcessID}'.`);
                break;
            }

            if (processDigraph.runtime.inDegree(cellProcessID)




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

