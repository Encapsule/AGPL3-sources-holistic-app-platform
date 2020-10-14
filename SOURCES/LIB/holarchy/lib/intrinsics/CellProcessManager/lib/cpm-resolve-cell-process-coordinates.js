// cpm-resolve-cell-process-coordinates.js

const arccore = require("@encapsule/arccore");

const cpmGetCellProcessManagerData = require("./cpm-get-cell-process-manager-data");

(function() {

    const byCellProcessIDCache = {};
    const byCellProcessPathCache = {};
    const byCellProcessCoordinatesCache = {};

    let factoryResponse = arccore.filter.create({
        operationID: "0XCZSfBSRSuwYgeIfLHhVw",
        operationName: "cpmLib: Resolve Cell Process ID",
        operationDescription: "Coverts an CPM-created cell process ID IRUT into corresponding cell process path, APM ID, and instanceName (as is currently possible).",
        inputFilterSpec: {
            ____types: "jsObject",
            cellProcessID: { ____accept: "jsString" },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____types: "jsObject",
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString" }
            },
            cellProcessPath: { ____accept: "jsString" }
        },
        bodyFunction: (request_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (!byCellProcessIDCache[request_.cellProcessID]) {
                    // cache miss...

                    let cpmLibResponse = cpmGetCellProcessManagerData.request({ ocdi: request_.ocdi });
                    if (cpmLibResponse.error) {
                        errors.push(cpmLibResponse.error);
                        break;
                    }
                    const cpmDataDescriptor = cpmLibResponse.result;
                    const ownedCellProcesses = cpmDataDescriptor.data.ownedCellProcesses;

                    if (!ownedCellProcesses.digraph.isVertex(request_.cellProcessID)) {
                        errors.push(`Cannot resolve cellProcessID '${request_.cellProcessID}'. Cell Process Manager is not familiar with the cell process you are seeking.`);
                        break;
                    }

                    const vertexProps = ownedCellProcessed.digraph.getVertexProperty(request_.cellProcessID);
                    

                }
                response.result = byCellProcessIDCache[request_.cellProcessID]; // returned cached result
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

    const resolveCellProcessID = factoryResponse.result;

    factoryResponse = arccore.filter.create({
        operationID: "6qK5QrJ4Tu2kWi3HOLlbKw",
        operationName: "cpmLib: Resolve Cell Process Coordinates",
        operationDescription: "Converts an APM ID / instance name string pair cell process coordinates to equivalent representations: cellPath, and cellID (an IRUT hash of cellPath).",
        inputFilterSpec: {
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____types: "jsObject",
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
            },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____types: "jsObject",
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString" }
            },
            cellProcessesPath: { ____accept: "jsString" },
            cellProcessPath: { ____accept: "jsString" },
            cellProcessID: { ____accept: "jsString" }
        },
        bodyFunction: (request_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;


                if (!byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID]) {

                    const cellProcessesPath = `~.${request_.cellProcessCoordinates.apmID}_CellProcesses`;
                    let ocdResponse = request_.ocdi.getNamespaceSpec(cellProcessesPath);
                    if (ocdResponse.error) {
                        errors.push(`Cell process coordinates cannot be resolved to CPM process path/ID because the APM specified, ID '${request_.cellCoordinates.apmID}', is not known inside this CellProcessor instance. Error detail:`);
                        errors.push(ocdResponse.error);
                        break;
                    }
                    byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID] = { cellProcessesPath, instances: {} };

                } // if APM ID cache miss

                if (!byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName]) {

                    const cellProcessesPath = byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID].cellProcessesPath;

                    const cellProcessInstanceIdentifier = arccore.identifier.irut.fromReference(request_.cellProcessCoordinates.instanceName).result;
                    const cellProcessPath = `${cellProcessesPath}.cellProcessMap.${cellProcessInstanceIdentifier}`;

                    const cellProcessID = arccore.identifier.irut.fromReference(cellProcessPath).result;

                    byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName] = {
                        cellProcessCoordinates: request_.cellProcessCoordinates,
                        cellProcessesPath,
                        cellProcessPath,
                        cellProcessID
                    };

                    byCellProcessPathCache[cellProcessPath] = {
                        cellProcessCoordinates: request_.cellProcessCoordinates,
                        cellProcessID
                    };

                    byCellProcessIDCache[cellProcessID] = {
                        cellProcessCoordinates: request_.cellProcessCoordinates,
                        cellProcessPath
                    };

                } // if instanceName cache miss

                // Return the cached result.
                response.result = byCellProcessCoordinatesCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName]; // returned cached result

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

    const resolveCellProcessCoordinates = factoryResponse.result;

    module.exports = {
        resolveCellProcessID,
        resolveCellProcessCoordinates
    };

})();
