// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

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

    actionResultSpec: { ____accept: "jsUndefined" }, // calling this action returns no result whatsoever

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process initializing...");

            const message = request_.actionRequest.holarchy.CellProcessor.initialize;

            const cellProcessManagerDataPath = `~.${cpmMountingNamespaceName}.cellProcessManager`;

            let ocdResponse = request_.context.ocdi.readNamespace(cellProcessManagerDataPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            let cellProcessManagerData = ocdResponse.result;

            let graphFactoryResponse = arccore.graph.directed.create(
                cellProcessManagerData.ownedCellProcesses.digraph?
                    cellProcessManagerData.ownedCellProcesses.digraph
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

            cellProcessManagerData.ownedCellProcesses.digraph = graphFactoryResponse.result;

            graphFactoryResponse = arccore.graph.directed.create(
                cellProcessManagerData.sharedCellProcesses.digraph?
                    cellProcessManagerData.sharedCellProcesses.digraph
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

            cellProcessManagerData.sharedCellProcesses.digraph = graphFactoryResponse.result;

            ocdResponse = request_.context.ocdi.writeNamespace(cellProcessManagerDataPath, cellProcessManagerData);
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

