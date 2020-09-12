// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-connect.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../lib/ControllerAction");
const OCD = require("../../../lib/ObservableControllerData");
const cpmLib = require("../CellProcessManager/lib");

const action = new ControllerAction({
    id: "X6ck_Bo4RmWTVHl-vk-urw",
    name: "Cell Process Proxy: Connect Proxy",
    description: "Disconnect a connected cell process proxy process (if connected). And, connect the proxy to the specified local cell process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    proxy: {
                        ____types: "jsObject",
                        connect: {
                            ____types: "jsObject",
                            // Connect from this proxy process (a helper cell process)...
                            proxyPath: {
                                ____accept: "jsString",
                                ____defaultValue: "#"
                            },
                            // ... to this new or existing local cell process.
                            localCellProcess: {
                                ____types: "jsObject",
                                apmID: {
                                    ____accept: "jsString"
                                },
                                instanceName: {
                                    ____accept: "jsString",
                                    ____defaultValue: "singleton"
                                }
                            }
                        }
                    }
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

            // Get the CPM process' data.
            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;

            const thisCellProcessID = arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result;

            if (!cpmDataDescriptor.data.ownedCellProcesses.digraph.isVertex(thisCellProcessID)) {
                errors.push(`Invalid apmBindingPath value '${request_.context.apmBindingPath}' does not correspond to an active cell process.`);
                break;
            }

            const message = request_.actionRequest.holarchy.CellProcessor.process.proxy.connect;

            let ocdResponse = OCD.dataPathResolve({ dataPath: message.proxyPath, apmBindingPath: request_.context.apmBindingPath });
            if (ocdResponse.error) {
                errors.push(`Invalid proxyPath value '${message.proxyPath}' cannot be used to build the binding path of the cell process proxy helper cell process.`);
                errors.push(ocdResponse.error);
                break;
            }

            const proxyPath = ocdResponse.result;

            if (!proxyPath.startsWith(request_.context.apmBindingPath)) {
                errors.push(`Invalid proxyPath value '${message.proxyPath}' resolves to an apmBindingPath value '${proxyPath}' that is outside of the proxy owner process' cell memory space!`);
                break;
            }

            ocdResponse = request_.context.ocdi.getNamespaceSpec(proxyPath);
            if (ocdResponse.error) {
                errors.push(`Invalid proxyPath value '${message.proxyPath}' resolves to an apmBindingPath value '${proxyPath}' that is not declared within the proxy owner process' memory space!`);
                break;
            }

            const proxyNamespaceSpec = ocdResponse.result;

            if (!proxyNamespaceSpec.____appdsl || (proxyNamespaceSpec.____appdsl.apm !== "CPPU-UPgS8eWiMap3Ixovg")) {
                errors.push(`Invalid proxyPath value '${message.proxyPath}' resolves to an apmBindingPath value '${proxyPath}' in the owning process' memory space that is missing or has unexpected APM binding annotation.`);
                errors.push(`'${proxyPath}' not bound to CellProcessProxy APM; missing ____appdsl annotation?`);
                break;
            }

            ocdResponse = request_.context.ocdi.readNamespace(proxyPath);
            if (ocdResponse.error) {
                errors.push(`Failed to connect cell process proxy because the helper process' cell memory cannot be read from path '${proxyPath}'.`);
                errors.push(ocdResponse.error);
                break;
            }

            let proxyData = ocdResponse.result;

            if (!proxyData || !proxyData["CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy"]) {
                errors.push("Failed to connect cell process proxy because the helper process has not been initialized by the owner cell process.");
                errors.push(ocdResponse.error);
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

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
