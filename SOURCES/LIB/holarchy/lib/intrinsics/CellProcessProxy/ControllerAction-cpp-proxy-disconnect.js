// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-disconnect.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const OCD = require("../../../lib/ObservableControllerData");
const cpmLib = require("../CellProcessManager/lib");
const cppLib = require("./lib");

const action = new ControllerAction({
    id: "ySiBEGcaRGWVOZmwBRyhrA",
    name: "Cell Process Proxy: Disconnect Proxy",
    description: "Disconnect a connected cell process proxy from whatever local cell process it is currently connected to.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessProxy: {
                ____types: "jsObject",
                disconnect: {
                    ____types: "jsObject",
                    // Disconnect this cell process proxy process instance...
                    proxyPath: {
                        ____accept: "jsString",
                        ____defaultValue: "#"
                    }
                    // ... from the local cell process that the proxy is connected to.
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsObject" // TODO
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.actionRequest.holarchy.CellProcessProxy.disconnect;

            // Get the CPM process' data.
            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const sharedCellProcesses = cpmDataDescriptor.data.sharedCellProcesses;

            // This ensures we're addressing an actuall CellProcessProxy-bound cell.
            // And, get us a copy of its memory and its current connection state.

            let cppLibResponse = cppLib.getStatus.request({
                apmBindingPath: request_.context.apmBindingPath,
                proxyPath: message.proxyPath,
                ocdi: request_.context.ocdi
            });
            if (cppLibResponse.error) {
                errors.push("Cannot locate the cell process proxy cell instance.");
                errors.push(cppLibResponse.error);
                break;
            }
            const cppMemoryStatusDescriptor = cppLibResponse.result;

            if (cppMemoryStatusDescriptor.status === "disconnected") {
                // We're already disconnected. So, this is a noop.
                response.result = { actionTaken: "noop" };
                break;
            }

            const proxyPath = cppMemoryStatusDescriptor.paths.resolvedPath;
            const proxyID = arccore.identifier.irut.fromReference(proxyPath).result;

            if (!sharedCellProcesses.digraph.isVertex(proxyID)) {
                errors.push(`INTERNAL ERROR: proxy disconnect action has found your proxy at path '${proxyPath}' in '${cppMemoryStatusDescriptor.status}' status.`);
                errors.push(`But, we cannot find the expected sharedCellProcesses.digraph vertex '${proxtID}'? Please report this...`);
                break;
            }

            let ocdResponse = request_.context.ocdi.writeNamespace(`${proxyPath}.CPPU-UPgS8eWiMap3Ixovg_private`, {}); // resets the state of the proxy cell
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            sharedCellProcesses.digraph.removeVertex(proxyID);

            cppLibResponse = cppLib.collectGarbage.request({ act: request_.context.act, cpmData: cpmDataDescriptor.data, ocdi: request_.context.ocdi });
            if (cppLibResponse.error) {
                errors.push("Oh snap! An error occurred during garbage collection!");
                errors.push(cppLibResponse.error);
                break;
            }

            ocdResponse = request_.context.ocdi.writeNamespace(
                {
                    apmBindingPath: cpmDataDescriptor.path,
                    dataPath: "#.sharedCellProcesses.revision"
                },
                cpmDataDescriptor.data.sharedCellProcesses.revision + 1
            );
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            response.result = { actionTaken: "disconnected" };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
