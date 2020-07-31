// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");
const ObservableProcessController = require("../../lib/ObservableProcessController");




const caCP = [
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

            let cpSpec = {
                ____label: "Cell Processor",
                ____description: "CellProcessor runtime host instance manager process.",
                ____types: "jsObject",
                ____defaultValue: {},
                "x7pM9bwcReupSRh0fcYTgw_CellProcessor": {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    cellProcessDigraph: {
                        ____types: "jsObject",
                        api: { ____accept: [ "jsUndefined", "jsObject" ] },
                        serialized: { ____accept: [ "jsUndefined", "jsObject" ] }
                    }
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
                const apmProcessesNamespace = `${apmID}_CellProcesses`;

                cpSpec[apmProcessesNamespace] = {
                    ____label: `${apmFilterName} Cell Processes Map`,
                    ____description: `A map of ${apmFilterName} process instances by process ID that are managed by the CellProcessor (~) runtime host instance.`,
                    ____types: [ "jsUndefined", "jsObject" ], // We do not necessarily have active cell process(es) of this type at all times.
                    ____asMap: true,
                    cellProcessID: {
                        ____label: `${apmFilterName} Cell Process Instance`,
                        ____description: `Cell process instance memory for ${apmFilterName}: ${apmDescription}`,
                        ____types: "jsObject",
                        ____appdsl: { apm: apmID } // <3 <3 <3
                    }
                };

            } // end for apmConfig.length


            // Now create a new CellModel for the Cell Process Managager.

            const cpCMID = arccore.identifier.irut.fromReference(`${request_.id}_CellProcessor_CellModel`).result;

            const cpCM = new CellModel({
                id: cpCMID,
                name: `${cpName} Cell Processor`,
                description: `Manages the lifespan of cell processes executing in the ${cpName} CellProcessor runtime host instance.`,
                apm: {
                    id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcess_AbstractProcessModel`).result,
                    name: `${cpName} Cell Process Manager`,
                    description: `Defines shared memory and stateful behaviors for ${cpName} CellProcessor runtime host instance.`,
                    ocdDataSpec: cpSpec
                    // steps <- yes, but not quite yet
                },
                actions: caCP,
                subcells: [ request_.cellmodel ]
            });

            if (!cpCM.isValid()) {
                errors.push(cpCM.toJSON());
                break;
            }

            // Now instantiate an ObservableProcessController runtime host instance using configuration derived from the Cell Processor's model.

            const cpOPC = new ObservableProcessController({
                id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcessor_ObservableProcessController`).result,
                name: `${cpName} Observable Process Controller`,
                description: `Provides shared memory and runtime automata process orchestration for ${cpName} CellProcessor-resident cell processes.`,
                ocdTemplateSpec: {
                    ____types: "jsObject",
                    ____appdsl: { apm: cpCMID }
                },
                abstractProcessModelSets: [ cpCM.getCMConfig({ type: "APM" }).result ],
                transitionOperatorSets: [ cpCM.getCMConfig({ type: "TOP" }).result ],
                constrollerActionSets: [ cpCM.getCMConfig({ type: "ACT" }).result ]
            });

            if (!cpOPC.isValid()) {
                errors.push(cpOPC.toJSON());
                break;
            }

            response.result = {
                cm: cpCM,
                opc: cpOPC
            };

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
