// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");

const cpmNamespace = "LCP3-7RTSPO_V0ptQ24uOw_CellProcessManager";

const caCPM = [
    require("../intrinsics/ControllerAction-cpm-initialize"),
    require("../intrinsics/ControllerAction-cpm-process-create"),
    require("../intrinsics/ControllerAction-cpm-process-delete"),
    require("../intrinsics/ControllerAction-cpm-process-query"),
    require("../intrinsics/ControllerAction-cpm-query")
];

const factoryResponse = arccore.filter.create({

    operationID: "7tYVAis3TJGjaEe-6DiKHw",
    operationName: "SoftwareCellProcessor::constructor Filter",
    operationDescription: "Filters request descriptor passed to SoftwareCellProcessor::constructor function.",

    inputFilterSpec: {

        ____label: "Software Cell Processor Descriptor",
        ____description: "A request object passed to the SoftwareCellProcessor ES6 class constructor function.",
        ____types: "jsObject",

        id: {
            ____label: "Processor ID",
            ____description: "A unique version-independent IRUT identifier used to identify this SoftwareModel.",
            ____accept: "jsString" // must be an IRUT
        },

        name: {
            ____label: "Processor Name",
            ____description: "A short name used to refer to this SoftwareCellProcessor.",
            ____accept: "jsString"
        },

        description: {
            ____label: "Processor Description",
            ____description: "A short description of this SoftwareCellProcessor's purpose and/or function.",
            ____accept: "jsString"
        },

        cellmodel: {
            ____label: "App/Service Cell Model",
            ____description: "Either a CM descriptor or equivalent CellModel ES6 class instance.",
            ____accept: "jsObject" // further processed in bodyFunction
        },

        options: {
            ____label: "Options",
            ____description: "Optional behavioral overrides and runtime settings.",
            ____types: "jsObject",
            ____defaultValue: {}
        }

    },

    bodyFunction: (request_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while(!inBreakScope) {
            inBreakScope = true;

            const cpName = `[${request_.id}::${request_.name}]`;

            // Dereference the input CellModel.
            const cellmodel = (request_.cellmodel instanceof CellModel)?request_.cellmodel:new CellModel(request_.cellmodel);
            if (!cellmodel.isValid()) {
                errors.push("Invalid CellModel specified for constructor request path ~.cellmodel:");
                errors.push(cellmodel.toJSON());
                break;
            }

            // Extract a list of the AbstractProcessModel's registered in this CellModel.
            let configResponse = cellmodel.getCMConfig({ type: "APM" });
            if (configResponse.error) {
                errors.push("Unexpected internal error querying APM configuration of specified CellModel. Please report this error:");
                errors.push(configResponse.error);
            }
            const apmConfig = configResponse.result;

            // Synthesize the Cell Process Manager OCD filter specification.

            let cpmSpec = { ____types: "jsObject" };
            cpmSpec[cpmNamespace] = {
                ____label: "Cell Process Manager",
                ____description: "CellProcessor's primary job is to manage the creation, deletion, and connection of cell processes.",
                ____types: "jsObject",
                ____defaultValue: {},
                processData: {
                    ____label: "Cell Process Data",
                    ____description: "Memory allocation for all cell processes that could possibly be created by this CellProcessor instance.",
                    ____types: "jsObject",
                    ____defaultValue: {}
                    // The top-level properties of this descriptor object are added programmatically below;
                    // one for each APM discovered in the input CellModel.
                },
                // TODO: Track this as it evolves. And, lock it down as appropriate here as it stabilizes.
                // NOTE: This placeholder isn't read or written yet; just a null placeholder for now.
                processDigraph: {
                    ____label: "Cell Process Relationship Digraph",
                    ____accept: [ "jsUndefined", "jsObject" ],
                }
            }

            // The Cell Process Manager manages some number of subcell processes.
            // Here we allocate a prescriptively-named map of process instances for each Abstract Process Model (APM)
            // discovered in the in the input CellModel instance.

            for (let i = 0 ; i < apmConfig.length ; i++) {
                const apm = apmConfig[i];
                const apmID = apm.getID();
                const apmName = apm.getName();
                const apmDescription = apm.getDescription();
                const apmFilterName = `[${apmID}::${apmName}]`;
                const pmapNamespace = `${apmID}_CellProcesses`;
                cpmSpec[cpmNamespace].processData[pmapNamespace] = {
                    ____label: `${apmFilterName} Cell Process Map`,
                    ____description: `A map of ${apmFilterName} process instances by process ID that are managed by the CellProcessor (~) runtime host.`,
                    ____types: [ "jsUndefined", "jsObject" ],
                    ____asMap: true,
                    cellProcessID: {
                        ____label: `${apmFilterName} Cell Process Instance`,
                        ____description: apmDescription,
                        ____types: "jsObject",
                        ____appdsl: { apm: apmID } // <3 <3 <3
                    }
                };

            } // end for apmConfig.length


            // Now create a new CellModel for the Cell Process Managager.

            const cpmCellModel = new CellModel({
                id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcessManager_CM`).result,
                name: `${cpName} Cell Process Manager`,
                description: `Manages the lifespan of cell processes executing in CellProcessor ${cpName} runtime host instance.`,
                apm: {
                    id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcessManager_APM`).result,
                    name: `${cpName} Cell Process Manager`,
                    description: `Defines shared memory and stateful behaviors for ${cpName} CellProcessor runtime host instance cell process lifespan management.`,
                    ocdDataSpec: cpmSpec
                    // steps <- yes, but not quite yet
                },
                actions: caCPM,
                subcells: [ request_.cellmodel ]
            });

            if (!cpmCellModel.isValid()) {
                errors.push(cpmCellModel.toJSON());
                break;
            }

            response.result = cpmCellModel;

            /* MORE MAGICS */

            break;

        } // end while

        if (errors.length) {
            errors.unshift("Cannot construct CellProcessor due to error:");
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
