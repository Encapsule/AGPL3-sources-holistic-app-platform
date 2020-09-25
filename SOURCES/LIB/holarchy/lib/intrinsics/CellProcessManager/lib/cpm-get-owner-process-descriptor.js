// cpm-get-owner-process-descriptor.js

const arccore = require("@encapsule/arccore");

/*
e.g.
ocdData = { // <= some arbitrary cell memory (i.e. we presume this object is bound to an APM and is a "cell"
    x: { // just an object owned by this cell
        helper1: { // another object owned by this cell (e.g. we could address this namespace as #.x.helper1 in an operator or action or APM step)
            proxy1: { // another helper #.x.helper1.proxy1 which we presume is an object bound to the CPP APM
        }
    }
}
*/

const activeCellDescriptor = {
    ____label: "Active Cell Descriptor",
    ____description: "An object that models an active cell.",
    ____types: "jsObject",
    cellPath: {
        ____label: "Active Cell Path",
        ____description: "The fully-qualified OCD data path of the active cell whose ownershipVector is included in this response.result.",
        ____accept: "jsString"
    },
    cellAPMID: {
        ____label: "Active Cell APM ID",
        ____description: "The APM binding ID of the active cell at response.result.cellPath.",
        ____accept: "jsString"
    },
    cellRole: {
        ____label: "Active Cell Role",
        ____description: "The current role of the active cell at response.result.cellPath.",
        ____accept: "jsString",
        ____inValueSet: [ "helper", "process" ]
    },
    cellStrategy: {
        ____label: "Cell CPM Strategy",
        ____description: "The strategy used by the CellProcessor's Cell Process Manager (CPM) to track the active cell at response.result.cellPath.",
        ____accept: "jsString",
        ____inValueSet: [ "helper", "owned", "shared" ]
    },
    cellID: {
        ____label: "Cell ID",
        ____description: "The cell ID of the active cell at response.result.cellPath. If cellRole === process this is also the cell process ID.",
        ____accept: [ "jsString" ],
        ____defaultValue: null
    }
};

const factoryResponse = arccore.filter.create({

    operationID: "A9HTmM0IRw2z3Q2oqFkqCg",
    operationName: "cpmLib: Get Cell Owner Report",
    operationDescription: "Query CPM to get current cell ownership report data for the active cell at request.cellPath.",

    inputFilterSpec: {
        ____label: "Get Cell Owner Report Request",
        ____description: "Request to get current cell ownership report data for active cell at request.cellPath.",
        ____types: "jsObject",
        cellPath: { ____accept: "jsString" },
        cpmDataDescriptor: { ____accept: "jsObject" },
        ocdi: { ____accept: "jsObject" },
    },

    outputFilterSpec: {
        ____label: "Cell Ownership Report Result",
        ____description: "Cell Process Manager (CPM) active cell ownership report for cell at request.cellPath.",
        ____types: "jsObject",
        ____defaultValue: {},
        ownershipVector: {
            ____label: "Active Cell Ownership Vector",
            ____description: "An ordered array used as a vector container. From first-to-last element each element represents a cell that contains the cell addressed by response.result.cellPath. The last element is always a cell that is also a cell process (either owned or shared process) managed by CellProcessor's Cell Process Manager.",
            ____types: "jsArray",
            ____defaultValue: [],
            activeCellDescriptor
        }
    },

    bodyFunction: function(request_) {
        const response = { error: null, result: { ownershipVector: [] } };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            if (!request_.cellPath.startsWith("~")) {
                errors.push(`Invalid path '${request_.cellPath}'. String value must be an absolute dot-delimited ObservableControllerData namespace path beginning with the anonymous namespace token, ~.`);
                break;
            }

            const pathTokens = request_.cellPath.split(".");
            const ownedCellProcesses = request_.cpmDataDescriptor.data.ownedCellProcesses;
            const sharedCellProcesses = request_.cpmDataDescriptor.data.sharedCellProcesses;
            let tokensProcessed = -1;

            while (pathTokens.length) {
                tokensProcessed++;
                const currentPath = pathTokens.join(".");
                const ocdMappingPath = (currentPath !== "~")?currentPath:request_.cpmDataDescriptor.path; // TODO: Fix this hacktrocity caused by mounting CPM to private namespace instead of ~ as it should be.
                const ocdResponse = request_.ocdi.getNamespaceSpec(ocdMappingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const currentPathNamespaceSpec = ocdResponse.result;
                const isCurrentPathCell = currentPathNamespaceSpec.____appdsl && currentPathNamespaceSpec.____appdsl.apm;

                if (!tokensProcessed && !isCurrentPathCell) {
                    errors.push(`Invalid path '${request_.cellPath}'. The cellPath value must resolve to a cell (not just some cell's contained data) that is active as a helper. Or, that is active as either an owned are shared cell process managed by the CPM."`);
                    break;
                }

                if (!isCurrentPathCell) {
                    pathTokens.pop();
                    continue;
                }

                const currentPathCellID = arccore.identifier.irut.fromReference(currentPath).result;

                let activeCellDescriptor = { cellPath: currentPath, cellAPMID: currentPathNamespaceSpec.____appdsl.apm, cellID: currentPathCellID };

                const isCurrentPathCellProcess = ownedCellProcesses.digraph.isVertex(currentPathCellID);

                if (!isCurrentPathCellProcess) {
                    activeCellDescriptor.cellRole = "helper";
                    activeCellDescriptor.cellStrategy = "helper"
                    response.result.ownershipVector.push(activeCellDescriptor);
                    pathTokens.pop();
                    continue;
                }

                let isCurrentPathCellProcessOwned = true;

                if (sharedCellProcesses.digraph.isVertex(currentPathCellID)) {
                    const vertexProp = sharedCellProcesses.digraph.getVertexProperty(currentPathCellID);
                    if (vertexProp.role === "shared") {
                        isCurrentPathCellProcessShared = false;
                    } else {
                        errors.push("Internal error in CPM >:/");
                        break;
                    }
                }

                activeCellDescriptor.cellRole = "process";
                activeCellDescriptor.cellStrategy = isCurrentPathCellProcessOwned?"owned":"shared";
                response.result.ownershipVector.push(activeCellDescriptor);

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

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


