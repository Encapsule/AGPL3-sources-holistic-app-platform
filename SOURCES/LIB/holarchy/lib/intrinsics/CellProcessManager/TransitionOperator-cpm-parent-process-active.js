// TransitionOperator-cpm-parent-process-active.js

const arccore = require("@encapsule/arccore");
const cpmLib = require("./lib");
const TransitionOperator = require("../../../TransitionOperator");
const cellProcessQueryRequestFilterBySpec = require("./lib/iospecs/cell-process-query-request-filterby-spec");

// TODO: This operator will require one or more APM ID's be specified as a mandatory filter.
// Otherwise, this is essentially meaningless as it will always return true for all cell processes
// created via CPM create process (because they're all by definition descendents of CPM, the intrincis cell process bound to the anonymous OCD namespace, ~).

const transitionOperator = new TransitionOperator({
    id: "9HNGDusyTtKpleXFae7O5A",
    name: "Cell Process Manager: Parent Process Active",
    description: "Returns Boolean true iff request.context.apmBindingPath is a cell process with an active parent process.",

    operatorRequestSpec: {
        ____types: "jsObject",
        CellProcessor: {
            ____types: "jsObject",
            cell: {
                ____types: "jsObject",
                cellCoordinates: {
                    ____types: [
                        // If a string, then the caller-supplied value must be either a fully-qualified or relative path to a cell.
                        // Or, an IRUT that resolves to a known cellProcessID (that by definition must resolve to an active cell).
                        "jsString",
                        // If an object, then the caller has specified the low-level apmID, instanceName coordinates directly.
                        "jsObject",
                    ],
                    ____defaultValue: "#",
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }

                },
                query: {
                    ____types: "jsObject",
                    filterBy: cellProcessQueryRequestFilterBySpec,
                    parentProcessActive: { ____accept: "jsObject" }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        let response = { error: null, result: false };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // This is all we can ever be 100% sure about based on the apmBindingPath.
            if (request_.context.apmBindingPath === "~") {
                break; // response.result === false
            }

            const messageBody = request_.operatorRequest.CellProcessor.cell;
            let unresolvedCoordinates = messageBody.cellCoordinates;

            if ((Object.prototype.toString.call(unresolvedCoordinates) === "[object String]") && unresolvedCoordinates.startsWith("#")) {
                let ocdResponse = ObservableControllerData.dataPathResolve({ apmBindingPath: request_.context.apmBindingPath, dataPath: unresolvedCoordinates });
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                unresolvedCoordinates = ocdResponse.result;
            }

            let cpmLibResponse = cpmLib.resolveCellCoordinates.request({ coordinates: unresolvedCoordinates, ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }

            const resolvedCoordinates = cpmLibResponse.result;

            cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;
            const ownedCellProcessesData = cpmDataDescriptor.data.ownedCellProcesses;

            // Get the parent process descriptor.
            cpmLibResponse = cpmLib.getProcessParentDescriptor.request({
                cellProcessID: arccore.identifier.irut.fromReference(request_.context.apmBindingPath).result,
                filterBy: messageBody.filterBy,
                ocdi: request_.context.ocdi,
                treeData: ownedCellProcessesData
            });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const parentCellProcessDescriptor = cpmLibResponse.result;

            response.result = parentCellProcessDescriptor.apmBindingPath?true:false;

            break;

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!transitionOperator.isValid()) {
    throw new Error(transitionOperator.toJSON());
}

module.exports = transitionOperator;
