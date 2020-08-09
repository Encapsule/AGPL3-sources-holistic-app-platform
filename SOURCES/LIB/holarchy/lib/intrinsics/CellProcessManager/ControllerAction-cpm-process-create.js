// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-create.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");


const controllerAction = new ControllerAction({
    id: "SdL0-5kmTuiNrWNu7zGZhg",
    name: "Cell Process Manager: Process Create",
    description: "Requests that the Cell Process Manager create a new cell process inside the CellProcessor runtime host instance.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    create: {
                        ____types: "jsObject",
                        apmID: { ____accept: "jsString" },
                        cellProcessUniqueName: { ____accept: [ "jsUndefined", "jsString" ] },
                        cellProcessInitData: { ____accept: "jsObject", ____defaultValue: {} }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        apmBindingPath: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null }, // this is the OCD path of the new process
        cellProcessID: { ____accept: [ "jsNull", "jsString"], ____defaultValue: null } // This is an IRUT-format per-CellProcessor-instance-unique ID
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process create...");

            // Dereference the body of the action request.
            const message = request_.actionRequest.holarchy.CellProcessor.process.create;

            // This is closely coupled w/the CellProcessor constructor filter.
            const apmProcessesNamespace = `~.${message.apmID}_CellProcesses`;

            // Query the ObservableCellData instance (ocdi) to determine if the apmID value passed by the caller is legitimate.
            let ocdResponse = request_.context.ocdi.getNamespaceSpec(apmProcessesNamespace);
            if (ocdResponse.error) {
                errors.push(`Invalid apmID value '${message.apmID}' specified. No CellModel registered in this CellProcessor based on this AbstractProcessModel.`);
                errors.push(ocdResponse.error);
                break;
            }

            // Derive the IRUT-format hash of the caller's specified cellProcessUniqueName. Or, if not specified use a IRUT-format v4 UUID instead.
            // The implication here is test vector log stability in holodeck primarily:
            // So, I recommend but do not require that derived apps / services always specifiy cellProcessUniqueName value.

            let apmProcessInstanceID =
                (message.cellProcessUniqueName?
                 arccore.identifier.irut.fromReference(message.cellProcessUniqueName).result
                 :
                 arccore.identifier.irut.fromEther().result
                );

            // ... from which we can now derive the absolute OCD path of the new cell process (proposed).
            const apmBindingPath = `${apmProcessesNamespace}.cellProcessMap.${apmProcessInstanceID}`;

            // ... from which we can now derive the new cell process ID (proposed).
            const cellProcessID = arccore.identifier.irut.fromReference(apmBindingPath).result;

            // ... And, while we're at it we'll need the ID of the proposed parent cell process as well.
            const parentCellProcessID = arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result;

            // Now we have to dereference the cell process manager's cell process tree digraph runtime model
            const cellProcessTreePath = `~.${cpmMountingNamespaceName}.cellProcessTree`;

            // Read shared memory to retrieve a reference to the process manager's process tree data.
            ocdResponse = request_.context.ocdi.readNamespace(cellProcessTreePath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const cellProcessTreeData = ocdResponse.result;

            // Query the process tree digraph to determine if the new cell process' ID slot has already been allocated (i.e. it's a disallowed duplicate process create request).
            if (cellProcessTreeData.digraph.isVertex(cellProcessID)) {
                errors.push(`Invalid cellProcessUniqueName value '${message.cellProcessUniqueName}' is not unique. Cell process '${cellProcessID}' already exists.`);
                break;
            }

            // Query the process tree digraph to determine if the parent cell process ID exists.
            if (!cellProcessTreeData.digraph.isVertex(parentCellProcessID)) {
                errors.push(`The apmBindingPath '${request_.context.apmBindingPath}' specified by this request is not a valid parent cell process binding path.`);
                errors.push(`Cell process ID '${parentCellProcessID}' is not known to cell process manager.`);
                break;
            }

            // Attempt to initialize the new cell process' shared memory.
            ocdResponse = request_.context.ocdi.writeNamespace(apmBindingPath, message.cellProcessInitData);
            if (ocdResponse.error) {
                errors.push(`Failed to create cell process at OCD path '${newProcessNamespace}' due to problems with the process initialization data specified.`);
                errors.push(ocdResponse.error);
            }

            // Record the new cell process in the cell process manager's digraph.
            cellProcessTreeData.digraph.addVertex({ u: cellProcessID, p: { apmBindingPath }});
            cellProcessTreeData.digraph.addEdge({ e: { u: parentCellProcessID, v: cellProcessID }});

            ocdResponse = request_.context.ocdi.writeNamespace(`${cellProcessTreePath}.revision`, cellProcessTreeData.revision + 1);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            const apmProcessesRevisionNamespace = `${apmProcessesNamespace}.revision`;

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

            // Respond back to the caller w/information about the newly-created cell process.
            response.result = { apmBindingPath, cellProcessID };
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

