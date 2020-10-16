// cpm-resolve-cell-process-coordinates.js

const arccore = require("@encapsule/arccore");

const cpmGetCellProcessManagerData = require("./cpm-get-cell-process-manager-data");
const ObservableControllerData = require("../../../../lib/ObservableControllerData");

const cpmMountingNamespaceName = require("../../../filters/cpm-mounting-namespace-name"); // Shim for CPM mounting path. Eventually, we'll bind CPM to ~ and remove this entirely.
const cpmPath = `~.${cpmMountingNamespaceName}`;

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
        // TODO: Once we have addressed current issue w/proxy helper depth, we will move CPM binding to ~ and remove this shim for good.
        const queryCellPath = (cellPath !== "~")?cellPath:cpmPath;

        const ocdResponse = ocdi.getNamespaceSpec(queryCellPath);
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
            coordinates: { apmID, instanceName }, cellProcessesPath: cache.byCellProcessCoordinates[apmID].dataPath, cellProcessPath, instanceID, cellProcessID
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
            coordinates: {
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
            coordinates: {
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
                const coordinatesTypeString = Object.prototype.toString.call(request_.coordinates);
                switch (coordinatesTypeString) {
                case "[object String]":
                    if (arccore.identifier.irut.isIRUT(request_.coordinates).result) {
                        // Resolve by cellProcessID.
                        response.result = cache.byCellProcessID[request_.coordinates];
                        if (!response.result) {
                            errors.push(`Unknown cellProcessID '${request_.coordinates}'.`);
                        }
                    } else {
                        // Resolve by cellProcessPath.
                        // A "cell process" is entirely an abstraction implemented by the Cell Process Manager.
                        // At this point we know the caller has passed a string value that is not an IRUT.
                        // So, we have ruled out the possibility that the caller wishes to resolve the cell process
                        // via cellProcessID. And, now conclude via elimination that if the string value is valid
                        // that it has to be an OCD path that is a valid data path, a valid cell path, and a valid
                        // cell process path in this CellProcessor instance. Currently, there are two possibilities:
                        // 1. request_.coordinates is a previously cached cellProcessPath (i.e. the process was created via CPM activate)
                        // 2. request_.coordinates is literally === "~" indicating an attempt to resolve the CPM daemon process.

                        // Bias for the 99% case - we're attempting to resolve a cellProcessPath previously cached via resolving raw APM ID, instanceName coordinates.
                        response.result = cache.byCellProcessPath[request_.coordinates];

                        if (!response.result) {

                            if (request_.coordinates !== "~") {
                                errors.push(`Unknown cellProcessPath '${request_.coordinates}'.`);
                                break;
                            }
                            if (!isValidCellPath({ cellPath: "~", ocdi: request_.ocdi })) {
                                throw new Error("Internal error: violation of invariant assumption.");
                            }
                            const cellPathDescriptor = cache.byCellPath["~"];

                            response.result = cache.byCellProcessPath["~"] = { coordinates: { apmID: cellPathDescriptor.apmID, instanceName: "daemon" }, cellProcessesPath: "~", cellProcessPath: "~", instanceID: "daemon", cellProcessID: cellPathDescriptor.cellPathID };
                        }
                    }
                    break;
                case "[object Object]":
                    // The caller has specified the raw cell process coordinates descriptor object.
                    const c = request_.coordinates;
                    if (isValidCellProcessInstanceCoordinates({ apmID: c.apmID, instanceName: c.instanceName, ocdi: request_.ocdi })) {
                        response.result = cache.byCellProcessCoordinates[c.apmID].instances[c.instanceName];
                    } else {
                        errors.push(`No activatable cell process at coordinates apmID '${request_.coordinates.apmID}' instanceName '${request_.coordinates.instanceName}.`);
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
            coordinates: {
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

                let cpmLibResponse = resolveCellProcessCoordinates.request({ coordinates: request_.coordinates, ocdi: request_.ocdi });
                if (!cpmLibResponse.error) {
                    let resolvedCoordinates = cpmLibResponse.result;
                    response.result = { cellPath: resolvedCoordinates.cellProcessPath, apmID: resolvedCoordinates.coordinates.apmID };
                    break;
                }
                if (!isValidCellPath({ cellPath: request_.coordinates, ocdi: request_.ocdi })) {
                    errors.push(`Invalid cellPath '${request_.coordinates}'.`);
                    break;
                }
                let cache = getCache({ ocdi: request_.ocdi });
                response.result = { cellPath: request_.coordinates, apmID: cache.byCellPath[request_.coordinates].apmID };
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
