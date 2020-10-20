
const arccore = require("@encapsule/arccore");

const ObservableControllerData = require("../../../../lib/ObservableControllerData");

const cpmLib = {
    getProcessManagerData: require("./cpm-get-cell-process-manager-data"),
    resolveCellCoordinates: require("./cpm-resolve-cell-coordinates")
};

const factoryResponse = arccore.filter.create({
    operationID: "qcjNiXamQP2iDk0yIsqu3A",
    operationName: "cpmLib: Process Family Operator Prologue",
    operationDescription: "Performs prologue function processing for all CPM TransitionOperator-cpm-X-process-Y calls.",
    inputFilterSpec: {
        ____types: "jsObject",
        unresolvedCellCoordinates: {
            ____types: [
                // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell.
                // Or, an IRUT that resolves to a known cellProcessID (that by definition must resolve to an active cell).
                "jsString",
                // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                "jsObject",
            ],
            ____defaultValue: "#",
            apmBindingPath: { ____accept: "jsString" },
            instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }

        },
        apmBindingPath: { ____accept: "jsString" },
        ocdi: { ____accept: "jsObject" }
    },
    outputFilterSpec: {
        ____types: "jsObject",
        cpmDataDescriptor: { ____accept: "jsObject" },
        ownedCellProcessesData: { ____accept: "jsObject" },
        resolvedCellCoordinates: { ____accept: "jsObject" }
    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let unresolvedCellCoordinates = request_.unresolvedCellCoordinates;

            if ((Object.prototype.toString.call(unresolvedCellCoordinates) === "[object String]") && unresolvedCellCoordinates.startsWith("#")) {
                let ocdResponse = ObservableControllerData.dataPathResolve({ apmBindingPath: request_.apmBindingPath, dataPath: unresolvedCellCoordinates });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                unresolvedCellCoordinates = ocdResponse.result;
            }

            let cpmLibResponse = cpmLib.resolveCellCoordinates.request({ coordinates: unresolvedCellCoordinates, ocdi: request_.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const resolvedCellCoordinates = cpmLibResponse.result;

            cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;

            response.result = {
                cpmDataDescriptor,
                ownedCellProcessesData,
                resolvedCellCoordinates
            };

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
