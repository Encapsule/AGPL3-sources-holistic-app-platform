// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-process-create.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../ControllerAction");
const cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");


const controllerAction = new ControllerAction({
    id: "SdL0-5kmTuiNrWNu7zGZhg",
    name: "Cell Process Manager: Process Create",
    description: "Requests that the Cell Process Manager create a new cell process inside the CellProcessor runtime host instance.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    create: {
                        ____types: "jsObject",
                        apmID: { ____accept: "jsString" },
                        cellProcessUniqueName: { ____accept: [ "jsUndefined", "jsString" ] },
                        cellProcessInitData: { ____accept: "jsObject", ____defaultValue: {} }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____types: "jsObject",
        apmBindingPath: { ____accept: [ "jsNull", "jsString" ], ____defaultValue: null }, // this is the OCD path of the new process
        cellProcessID: { ____accept: [ "jsNull", "jsString"], ____defaultValue: null } // This is an IRUT-format per-CellProcessor-instance-unique ID
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("Cell Process Manager process create...");

            const message = request_.actionRequest.holarchy.CellProcessor.process.create;

            const apmProcessesNamespace = `~.${message.apmID}_CellProcesses`;

            let ocdResponse = request_.context.ocdi.getNamespaceSpec(apmProcessesNamespace);
            if (ocdResponse.error) {
                errors.push(`Invalid apmID value '${message.apmID}' specified. No CellModel registered in this CellProcessor based on this AbstractProcessModel.`);
                errors.push(ocdResponse.error);
                break;
            }

            // Calculate the IRUT-format hash of the caller's specified cellProcessUniqueName. Or, if not specified use a IRUT-format v4 UUID instead.
            // The implication here is test vector log stability in holodeck primarily:
            // So, I recommend but do not require that derived apps / services always specifiy cellProcessUniqueName value.

            let apmProcessInstanceID =
                (message.cellProcessUniqueName?
                 arccore.identifier.irut.fromReference(message.cellProcessUniqueName).result
                 :
                 arccore.identifier.irut.fromEther().result
                );


            const apmBindingPath = `${apmProcessesNamespace}.${apmProcessInstanceID}`;
            const newCellProcessID = arccore.identifier.irut.fromReference(apmBindingPath).result;

            ocdResponse = request_.context.ocdi.getNamespaceSpec(apmBindingPath);
            if (!ocdResponse.error) {
                errors.push(`Invalid cellProcessUniqueName value '${message.cellProcessUniqueName}' is not unique; cell process already exists.`);
                break;
            }

            ocdResponse.writeNamespace(apmBindingPath, message.cellProcessInitData);
            if (ocdResponse.error) {
                errors.push(`Failed to create cell process at OCD path '${newProcessNamespace}' due to problems with the process initialization data specified.`);
                errors.push(ocdResponse.error);
            }

            response.result = { apmBindingPath: newProcessNamespace, cellProcessID };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;

