// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");
const cpmLib = require("./lib");

const controllerAction = new ControllerAction({
    id: "VNaA0AMsTXawb32xLaNGTA",
    name: "Cell Process Manager: Initialize",
    description: "Performs initialization of Cell Process Manager cell process (the root and parent process of all cell processes executing in a CellProcess runtime host instance).",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                initialize: {
                    ____types: "jsObject",
                    options: { ____accept: [ "jsUndefined", "jsObject" ] }
                }
            }
        }
    }, // actionRequestSpec

    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "okay"
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process initializing...");

            const message = request_.actionRequest.holarchy.CellProcessor.initialize;

            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const cpmDataDescriptor = cpmLibResponse.result;

            let graphFactoryResponse = arccore.graph.directed.create(
                cpmDataDescriptor.data.ownedCellProcesses.digraph?
                    cpmDataDescriptor.data.ownedCellProcesses.digraph
                    :
                    {
                        name: "Owned Cell Processes Tree Model",
                        description: "Tracks parent/child relationships between dynamically created cellular processes executing within a CellProcessor runtime host instance.",
                        vlist: [
                            { u: arccore.identifier.irut.fromReference("~").result, p: { apmBindingPath: "~", name: "Cell Process Manager" } }
                        ]
                    }
            );

            if (graphFactoryResponse.error) {
                errors.push(graphFactoryResponse.error);
                break;
            }

            cpmDataDescriptor.data.ownedCellProcesses.digraph = graphFactoryResponse.result;

            graphFactoryResponse = arccore.graph.directed.create(
                cpmDataDescriptor.data.sharedCellProcesses.digraph?
                    cpmDataDescriptor.data.sharedCellProcesses.digraph
                    :
                    {
                        name: "Shared Cell Processes Digraph Model",
                        description: "Tracks reference-counted relationships between shared cell processes and embedded worker cell processes."
                    }
            );

            if (graphFactoryResponse.error) {
                errors.push(graphFactoryResponse.error);
                break;
            }

            cpmDataDescriptor.data.sharedCellProcesses.digraph = graphFactoryResponse.result;

            let ocdResponse = request_.context.ocdi.writeNamespace(cpmDataDescriptor.path, cpmDataDescriptor.data);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

