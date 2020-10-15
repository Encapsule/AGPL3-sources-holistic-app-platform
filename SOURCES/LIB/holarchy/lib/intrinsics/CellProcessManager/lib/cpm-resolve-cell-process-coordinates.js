// cpm-resolve-cell-process-coordinates.js

const arccore = require("@encapsule/arccore");

const cpmGetCellProcessManagerData = require("./cpm-get-cell-process-manager-data");
const ObservableControllerData = require("../../../../lib/ObservableControllerData");

(function() {

    const cpmCache = {};

    function getMemoryMapVDID({ ocdi }) {
        return ocdi._private.accessFilters.read["~"].filterDescriptor.outputTypeVDID;
    }

    function getCache({ ocdi }) {
        const cpmVDID = getMemoryMapVDID({ ocdi });
        let cache = cpmCache[cpmVDID];
        if (!cache) {
            cache = cpmCache[cpmVDID] = { byDataPath: {}, byCellPath: {}, byCellProcessPath: {}, byCellProcessCoordinates: {}, byCellProcessID: {} };
        }
        return cache;
    }

    function isValidDataPath({ dataPath, ocdi }) {
        let cache = getCache({ ocdi });
        if (cache.byDataPath[dataPath]) {
            return true;
        }
        let ocdResponse = ocdi.getNamespaceSpec(dataPath);
        if (ocdResponse.error) {
            return false;
        }
        cache.byDataPath[dataPath] = { dataPathID: arccore.identifier.irut.fromReference(dataPath).result };
        return true;
    }

    function isValidCellPath({ cellPath, ocdi }) {
        let cache = getCache({ ocdi });
        if (cache.byCellPath[cellPath]) {
            return true;
        }
        if (!isValidDataPath({ dataPath: cellPath, ocdi })) {
            return false;
        }
        const ocdResponse = ocdi.getNamespaceSpec(cellPath);
        if (ocdResponse.error) {
            throw new Error("Internal error: invariant assumption violated.");
        }
        const namespaceSpec = ocdResponse.result;
        if (!namespaceSpec.____appdsl || !namespaceSpec.____appdsl.apm) {
            return false;
        }
        cache.byCellPath[cellPath] = { cellPathID: cache.byDataPath[cellPath].dataPathID, apmID: namespaceSpec.____appdsl.apm };
        return true;
    }

    function isCellProcessActivatable({ apmID, ocdi }) {
        let cache = getCache({ ocdi });
        if (cache.byCellProcessCoordinates[apmID]) {
            return true;
        }
        const dataPath = `~.${apmID}_CellProcesses`;
        if (!isValidDataPath({ dataPath, ocdi })) {
            return false;
        }
        cache.byCellProcessCoordinates[apmID] = { dataPath, apmID, instances: {} };
        return true;
    }

    function isValidCellProcessInstanceCoordinates({ apmID, instanceName, ocdi }) {
        let cache = getCache({ ocdi });
        if (!isCellProcessActivatable({ apmID, ocdi })) {
            return false;
        }
        if (cache.byCellProcessCoordinates[apmID].instances[instanceName]) {
            return true;
        }
        const instanceID = arccore.identifier.irut.fromReference(instanceName).result;
        const cellProcessPath = `${cache.byCellProcessCoordinates[apmID].dataPath}.cellProcessMap.${instanceID}`;
        if (!isValidCellPath({ cellPath: cellProcessPath, ocdi })) {
            return false;
        }
        const cellProcessID = cache.byCellPath[cellProcessPath].cellPathID;
        cache.byCellProcessCoordinates[apmID].instances[instanceName] = cache.byCellProcessID[cellProcessID] = cache.byCellProcessPath[cellProcessPath] = {
            cellProcessCoordinates: { apmID, instanceName }, cellProcessesPath: cache.byCellProcessCoordinates[apmID].dataPath, cellProcessPath, instanceID, cellProcessID
        };
        return true;
    }


    factoryResponse = arccore.filter.create({
        operationID: "6qK5QrJ4Tu2kWi3HOLlbKw",
        operationName: "cpmLib: Resolve Cell Process Coordinates",
        operationDescription: "Converts variant input type into a normalized cell process coordinates descriptor object.",
        inputFilterSpec: {
            ____label: "Cell Process Coordinates Resolve Request",
            ____description: "A variant input type that is resolved to the various equivalent representations of a cell process managed by the CellProcessManager daemon.",
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____label: "Cell Process Coordinates Variant",
                ____types: [
                    "jsString", // Either cellProcessID or cellProcessPath.
                    "jsObject", // Raw cellplane coordinate descriptor object.
                ],
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
                let cache = getCache({ ocdi: request_.ocdi });
                const coordinatesTypeString = Object.prototype.toString.call(request_.cellProcessCoordinates);
                switch (coordinatesTypeString) {
                case "[object String]":
                    if (arccore.identifier.irut.isIRUT(request_.cellProcessCoordinates).result) {
                        // Resolve by cellProcessID.
                        response.result = cache.byCellProcessID[request_.cellProcessCoordinates];
                        if (!response.result) {
                            errors.push(`Unknown cellProcessID '${request_.cellProcessCoordinates}'.`);
                        }
                    } else {
                        // Resolve by cellProcessPath.
                        response.result = cache.byCellProcessPath[request_.cellProcessCoordinates];
                        if (!response.result) {
                            errors.push(`Unknown cellProcessPath '${request_.cellProcessCoordinates}'.`);
                        }
                    }
                    break;
                case "[object Object]":
                    // The caller has specified the raw cell process coordinates descriptor object.
                    const c = request_.cellProcessCoordinates;
                    if (isValidCellProcessInstanceCoordinates({ apmID: c.apmID, instanceName: c.instanceName, ocdi: request_.ocdi })) {
                        response.result = cache.byCellProcessCoordinates[c.apmID].instances[c.instanceName];
                    } else {
                        errors.push(`No activatable cell process at coordinates apmID '${request_.cellProcessCoordinates.apmID}' instanceName '${request_.cellProcessCoordinates.instanceName}.`);
                    }
                    break;
                default:
                    errors.push("Internal error: Unhandled type string case.");
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

    const resolveCellProcessCoordinates = factoryResponse.result;




    let factoryResponse = arccore.filter.create({
        operationID: "0XCZSfBSRSuwYgeIfLHhVw",
        operationName: "cpmLib: Resolve Cell Coordindates",
        operationDescription: "Converts variant input type into a normalized cell coordinates descriptor object.",
        inputFilterSpec: {
            ____label: "Cell Coordinates Variant",
            ____types: "jsObject",
            cellCoordinates: {
                ____label: "Cell Process Coordinates Variant",
                ____types: [
                    "jsString", // Either cellPath or cellProcessPath or cellProcessID.
                    "jsObject", // Raw cellplane coordinate descriptor object.
                ],
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
            },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellPath: { ____accept: "jsString" },
            apmID: { ____accept: "jsString" }
        },
        bodyFunction: (request_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let cpmLibResponse = resolveCellProcessCoordinates.request({ cellProcessCoordinates: request_.cellCoordinates, ocdi: request_.ocdi });
                if (!cpmLibResponse.error) {
                    const resolvedCoordinates = cpmLibResponse.result;
                    response.result = { cellPath: resolvedCoordinates.cellProcessPath, apmID: resolvedCoordinates.cellProcessCoordinates.apmID };
                    break;
                }
                if (!isValidCellPath({ cellPath: request_.cellCoordinates, ocdi: request_.ocdi })) {
                    errors.push(`Invalid cellPath '${request_.cellCoordinates}'.`);
                    break;
                }
                let cache = getCache({ ocdi: request_.ocdi });
                response.result = { cellPath: request_.cellCoordinates, apmID: cache.byCellPath[request_.cellCoordinates].apmID };
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

    const resolveCellCoordinates = factoryResponse.result;

    module.exports = {
        resolveCellCoordinates,
        resolveCellProcessCoordinates
    };

})();
