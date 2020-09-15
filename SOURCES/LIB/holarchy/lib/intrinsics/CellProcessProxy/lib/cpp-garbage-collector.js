// cpp-run-shared-processes-garbage-collector.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "GCPRxmA6TYSxEyKRsjLVKg",
    operationName: "Cell Process Proxy: Garbage Collector",
    operationDescription: "When owned cell processes are deleted and when connections to shared cell processes are disconnected, the shared process digraph must be rebalanced. And, shared processes that no longer have connected proxies should be removed from the cell process manager's process tree (what we call the owned cell processes digraph).",

    inputFilterSpec: {
        ____types: "jsObject",
        cpmData: { ____accept: "jsObject" },
        ocdi: { ____accept: "jsObject" }
    },

    outputFilterSpec: {
        ____opaque: true // TODO
    },

    bodyFunction: function(request_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const ownedDigraph = request_.cpmData.ownedCellProcesses.digraph;
            const sharedDigraph = request_.cpmData.sharedCellProcesses.digraph;

            let gcContinue = true;
            while (gcContinue) {

                gcContinue = false;

                // Examine all the root vertices in the shared processes digraph.

                const rootVertices = sharedDigraph.getRootVertices();
                const leafVertices = sharedDigraph.getLeafVertices();

                const verticesToRemove = [];
                const sharedProcessesToDelete = [];

                while (rootVertices.length) {

                    const examineVertex = rootVertices.pop();
                    const examineVertexProp = sharedDigraph.getVertexProperty(examineVertex);

                    switch (examineVertexProp.role) {

                    case "owned-proxy":
                    case "shared-proxy":
                        // A helper cell that has reached the root has, by definition, no cell process proxies connected to it.
                        verticesToRemove.push(examineVertex);
                        break;

                    case "owned":
                        // A cell that is a process that is owned that has reached the root is an owned process that has no cell process proxies connected to it.
                        // However, it may be an owned process that hosts proxy(ies) that are connected to other cell processes.
                        // So, in this case the owned process vertex w/zero in-degree represents an owned process that is possibly
                        // holding references to other owned and shared processes. To determine if this is the case, we have to count
                        // its out-edges.
                        if (!sharedDigraph.outDegree(examineVertex)) {
                            // Okay. So this vertex represents an owned cell process that is itself hosting no connected cell process proxy instances at the moment.
                            // So, we no longer need to track it in the sharedCellProcesses.digraph.
                            verticesToRemove.push(examineVertex);
                        }
                        break;

                    case "shared":
                        // A cell that is a process that is shared that has reached the root has no connected cell process proxies. And, it represents the allocation
                        // of a special-owned cell process that is reference counted by this mechanism.
                        verticesToRemove.push(examineVertex);
                        sharedProcessesToDelete.push(examineVertexProp.apmBindingPath);
                        break;

                    default:
                        errors.push(`Unexpected shared process role value '${examineVertexProp.role}'.`);
                        break;
                    }

                    if (errors.length) {
                        break;
                    }

                } // while examine all current root vertices

                if (errors.length) {
                    break;
                }

                while (leafVertices.length) {
                    const examineVertex = leafVertices.pop();
                    const examineVertexProp = sharedDigraph.getVertexProperty(examineVertex);
                    switch (examineVertexProp.role) {
                    case "owned-proxy":
                    case "shared-proxy":
                        // Any proxy that's in the shared digraph indicates that that proxy helper cell thinks its connected.
                        // The fact that it's now a leaf vertex indicates that it's no longer connected. This may actually
                        // only occur when the connection was from a proxy cell to an owned cell process that has been deleted.
                        // So, we want to update the cell process proxy helper cell's state (put it in broken state), and then
                        // we want to remove the proxy vertex as we only allow connected proxies in the shared digraph.
                        const ocdResponse = request_.ocdi.writeNamespace( { apmBindingPath: examineVertexProp.apmBindingPath, dataPath: "#.lcpConnect" }, null );
                        if (ocdResponse.error) {
                            errors.push(ocdResponse.error);
                            break;
                        }
                        verticesToRemove.push(examineVertex);
                        break;
                    case "owned":
                    case "shared":
                        break;
                    default:
                        errors.push(`Unexpected shared process role value '${examineVertexProp.role}'.`);
                        break;
                    }

                }

                if (errors.length) {
                    break;
                }

                gcContinue = (verticesToRemove.length + sharedProcessesToDelete.length) > 0;

                while (verticesToRemove.length) {
                    sharedDigraph.removeVertex(verticesToRemove.pop());
                }

                

            } // end while gcContinue

            if (errors.length) {
                break;
            }

            break;

        } // end while !inBreakScope

        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
