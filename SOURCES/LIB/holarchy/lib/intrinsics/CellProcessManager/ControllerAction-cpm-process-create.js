// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessManager/ControllerAction-cpm-process-create.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");
const cpmLib = require("./lib");

const controllerAction = new ControllerAction({

    id: "SdL0-5kmTuiNrWNu7zGZhg",
    name: "Cell Process Manager: Process Create",
    description: "Create a new child cell process bound to the specified APM that is owned by the requesting cell process, #. Or, the specified parent cell process (via override).",

    actionRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            process: {
                ____types: "jsObject",
                processCoordinates: {
                    ____types: [
                        "jsString", // because it might be a cellProcessPath or cellProcessID
                        "jsObject" // because it might be a raw coordinates apmID, instanceName descriptor
                    ],
                    ____defaultValue: "#", // NOTE: That taking the default here will _never_ work by definition.
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString",  ____defaultValue: "singleton" },
                },
                activate: {
                    ____types: "jsObject",
                    processData: {
                        ____accept: [
                            "jsUndefined", // Most APM's define a memory specification that allows derived cells to be activated w/out process initialization data (i.e. the cell is initialized using APM-defined default values).
                            "jsObject"     // ... if this is not the case for a specific APM, or if the caller wishes to override the defaults specified by the APM then we know processData must be some object value (the details of which we don't care about at this level).
                        ]
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        apmBindingPath: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null }, // this is the OCD path of the new process
        cellProcessID: { ____accept: [ "jsNull", "jsString"], ____defaultValue: null } // This is an IRUT-format cell process ID
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log(`[${this.filterDescriptor.operationID}::${this.filterDescriptor.operationName}] starting...`);

            // Read shared memory to retrieve a reference to the CPM's private process management data.
            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcesses = cpmDataDescriptor.data.ownedCellProcesses;

            // Dereference the body of the action request.
            const messageBody = request_.actionRequest.CellProcessor.process;

            cpmLibResponse = cpmLib.resolveCellProcessCoordinates.request({ coordinates: messageBody.processCoordinates, ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const resolvedCellProcessCoordinates = cpmLibResponse.result;

            // Query ownedCellProcesses.digraph to determine if the new cell process' ID slot has already been allocated (i.e. it's a disallowed duplicate process create request).
            if (ownedCellProcesses.digraph.isVertex(resolvedCellProcessCoordinates.cellProcessID)) {
                errors.push(`The cell process could not be created as requested because cell process ID '${resolvedCellProcessCoordinates.cellProcessID}' is already active at path '${resolvedCellProcessCoordinates.cellProcessPath}'.`);
                break;
            }

            // Get ownership report.
            cpmLibResponse = cpmLib.getProcessOwnershipReportDescriptor.request({
                cellPath: request_.context.apmBindingPath,
                cpmDataDescriptor: cpmDataDescriptor,
                ocdi: request_.context.ocdi
            });
            if (cpmLibResponse.error) {
                errors.push(`The cell process could not be created as requested. While examining create process request made by an active cell at '${request_.context.apmBindingPath}' we were not able to deduce which cell process should be given ownership of the requested new cell process ID '${resolvedCellProcessCoordinates.cellProcessID}' to be activated at path '{resolvedCellProcessCoordinates.cellProcessPath}'. More detail:`);
                errors.push(cpmLibResponse.error);
                break;
            }
            const cellOwnershipReport = cpmLibResponse.result;

            // At this point we have cleared all hurdles and are prepared to create the new cell process.
            // We will do that first so that if it fails we haven't changed any CPM digraph models of the process table.
            let ocdResponse = request_.context.ocdi.writeNamespace(resolvedCellProcessCoordinates.cellProcessPath, messageBody.activate.processData);
            if (ocdResponse.error) {
                errors.push(`Failed to create cell process ID '${resolvedCellProcessCoordinates.cellProcessID}' at path '${resolvedCellProcessCoordinates.cellProcessPath}' due to problems with the process initialization data specified.`);
                errors.push(ocdResponse.error);
            }

            // Okay - the new cell process was created successfully!
            // Next we need to keep a record of what was done so we can undo it later. Unsuprisingly, this is a major pain in the ass to do this correctly. If you're here hunting bugs, sorry - really did my best! Otherwise, you're welcome.
            // So, now time for games w/the cellOwnershipVector and digraph.
            // The first element in the cellOwnershipVector always describes the cell that we've concluded is the caller's desired owner for the new cell process.
            // The last element in the cellOwnershipVector always describes first element's nearest-containing cell that is already being tracked by CPM (i.e. there's already a vertex for it in ownedCellProcesses.digraph.
            // If first === last then we're dealing with a cell we've dealth with previously in its lifespan that has just created itself a new child cell process.
            // If first !== last then [first...last) entries in the cellOwnershipVector describe the new cell processes owner (first entry) and an ordered list of its containers back to the point (last entry) where we've currently got a vertex in ownedCellProcesses.digraph.

            let parentCellOwnershipDescriptor = cellOwnershipReport.ownershipVector.pop();

            while (cellOwnershipReport.ownershipVector.length > 0) {
                const cellOwnershipDescriptor = cellOwnershipReport.ownershipVector.pop(); // pop from the end of the vector (ordered) to grab the descriptor of the cell that we know is already in ownedCellProcesses.digraph
                ownedCellProcesses.digraph.addVertex({ u: cellOwnershipDescriptor.cellID, p: { apmBindingPath: cellOwnershipDescriptor.cellPath, role: "cell-process-helper", apmID: resolvedCellProcessCoordinates.coordinates.apmID } });
                ownedCellProcesses.digraph.addEdge({ e: { u: parentCellOwnershipDescriptor.cellID, v: cellOwnershipDescriptor.cellID } });
                parentCellOwnershipDescriptor = cellOwnershipDescriptor;
            }

            // Record the new cell process in the cell process manager's digraph.
            ownedCellProcesses.digraph.addVertex({ u: resolvedCellProcessCoordinates.cellProcessID, p: { apmBindingPath: resolvedCellProcessCoordinates.cellProcessPath, role: "cell-process", apmID: resolvedCellProcessCoordinates.coordinates.apmID }});
            ownedCellProcesses.digraph.addEdge({ e: { u: parentCellOwnershipDescriptor.cellID, v: resolvedCellProcessCoordinates.cellProcessID }});

            ocdResponse = request_.context.ocdi.writeNamespace(`${cpmDataDescriptor.path}.ownedCellProcesses.revision`, ownedCellProcesses.revision + 1);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            const apmProcessesRevisionNamespace = `${resolvedCellProcessCoordinates.cellProcessesPath}.revision`;

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
            response.result = { apmBindingPath: resolvedCellProcessCoordinates.cellProcessPath, cellProcessID: resolvedCellProcessCoordinates.cellProcessID };
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
