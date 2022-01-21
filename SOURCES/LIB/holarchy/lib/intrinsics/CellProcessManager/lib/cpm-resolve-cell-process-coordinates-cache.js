// cpm-resolve-cell-process-coordinates-cache.js

const arccore = require("@encapsule/arccore");
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

    // If the fully-qualified (i.e. starts w/~ character) OCD path corresponds to a namespace located in the OCD's filter spec then it's a valid data path. Otherwise, it is not.

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

    // If the fully-qualified OCD path is a valid data path and the namespace descriptor indicates an APM binding then it's also a valid cell path.

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

    // The CellProcessManager (CPM) allocates an ObservableControllerData (OCD) namespace for every
    // AbstractProcessModel (APM) registered with the CellProcessor (CP) constructor function.

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
        // Determine if the specified APM is registered for use in this CellProcessor instance.
        if (!isCellProcessActivatable({ apmID, ocdi })) {
            return false;
        }
        // Determine if anyone has previously queried this specific named cell process instance.
        if (cache.byCellProcessCoordinates[apmID].instances[instanceName]) {
            return true;
        }

        // Convert the instanceName into an IRUT.
        const instanceID = arccore.identifier.irut.fromReference(instanceName).result;

        // Calcuate the apmBinding OCD path for the cell process instance.
        const cellProcessPath = `${cache.byCellProcessCoordinates[apmID].dataPath}.cellProcessMap.${instanceID}`;

        // Double check that path resolves to a valid namespace in the OCD w/an associated APM binding (which we don't check here).
        if (!isValidCellPath({ cellPath: cellProcessPath, ocdi })) {
            return false;
        }

        // Retrieve the cell process ID (an IRUT hash of the data path that's a named activable cell process instance).
        const cellProcessID = cache.byCellPath[cellProcessPath].cellPathID;

        cache.byCellProcessCoordinates[apmID].instances[instanceName] = cache.byCellProcessID[cellProcessID] = cache.byCellProcessPath[cellProcessPath] = {
            coordinates: { apmID, instanceName }, cellProcessesPath: cache.byCellProcessCoordinates[apmID].dataPath, cellProcessPath, instanceID, cellProcessID
        };

        return true;
    }

    module.exports = {
        getCache,
        isValidDataPath,
        isValidCellPath,
        isCellProcessActivatable,
        isValidCellProcessInstanceCoordinates
    };


})();
