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

            // TODO:
            // I think it's useful to remove this restriction in the future and allow any cell process to assert itself as the owner of the proxy.
            // Because, it actually may really be the owner of the proxy despite not being more than a helper cell process itself.
            // Note, that there's a similar nuanced restriction that applies to calling CPM process create from a worker cell process step action.
            // Where apmBindingPath is required to be a the path to an active owned cell process that is assigned as the single parent (owner) of
            // of every owned cell process (child) created w/CPM process create.

            if (!cpmDataDescriptor.data.ownedCellProcesses.digraph.isVertex(thisCellProcessID)) {
                errors.push(`Invalid apmBindingPath value '${request_.context.apmBindingPath}' does not resolve to an active worker or shared cell process.`);
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

            // At this point we know / are confident of the following:
            //
            // - We know which existing owned (i.e. allocated w/CPM process create) OR shared (i.e. allocated w/CPM process open) cell process will OWN (i.e. will hold, by proxy in this example) a reference to another local owned or shared cell process.
            // - We are confident that relative to the owner we can access the specified cell process proxy helper cell. And, that it is actually bound to the CellProcessProxy APM etc.
            //
            // However, we do not yet know anything yet about the local cell process that the caller wishes to connect to via the proxy instance. So, we look at that next.

            const lcpBindingPath = `~.${message.localCellProcess.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.localCellProcess.instanceName).result}`;

            ocdResponse = request_.context.ocdi.getNamespaceSpec(lcpBindingPath);
            if (ocdResponse.error) {
                errors.push(`Unknown APM ID value specified for localCellProcess.apmID. Do you have a CellModel registered w/APM ID value '${message.localCellProcess.apmID}'?`);
                errors.push(ocdResponse.error);
                break;
            }

            const lcpProcessID = arccore.identifier.irut.fromReference(lcpBindingPath).result;
            const proxyHelperID = arccore.identifier.irut.fromReference(proxyPath).result;

            // We now know it's possible to create an instance of the localCellProcess. But, we still do not know if the lcp is already present in
            // either the sharedCellProcesses.digraph and/or the ownedCellProcesses.digraph. And, the logic is a bit tricky. However, at this point
            // we can start to mutate the graphs because we're past the point where any bad input provided via request_ is likely to cause an error.
            
            if (!cpmDataDescriptor.data.sharedCellProcesses.digraph.isVertex(thisCellProcessID)) {
                // This host is not currently hosting any connected proxy helper instance(s). And, no other host owns proxy instance(s) that are connected to it.
                // And, we know the host must exist. So, it must be an owned cell process. Record it as such.
                cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: thisCellProcessID, p: { role: "owned", apmBindingPath: request_.context.apmBindingPath }});
            }


            if (cpmDataDescriptor.data.sharedCellProcesses.digraph.isVertex(proxyHelperID)) {
                // This indicates that this proxy helper instance is currently connected.
                cpmDataDescriptor.data.sharedCellProcesses.digraph.deleteVertex(proxyHelperID); // host -> proxy -> lcp (linked) ===> host lcp (unlinked)
            }
            cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: proxyHelperID, p: { role: "helper", apmBindingPath: proxyPath }});
            cpmDataDescriptor.data.sharedCellProcesses.digraph.addEdge({ e: { u: thisCellProcessID, v: proxyHelperID }, p: { role: "host-to-proxy" }});
            
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
