// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");
const CellProcessorIntrinsics = require("../intrinsics/CellProcessor");
const HolarchyCore = require("../intrinsics/HolarchyCore");
const ObservableProcessController = require("../../lib/ObservableProcessController");
const cpmMountingNamespaceName = require("./cpm-mounting-namespace-name");

const factoryResponse = arccore.filter.create({

    operationID: "7tYVAis3TJGjaEe-6DiKHw",
    operationName: "CellProcessor::constructor Filter",
    operationDescription: "Encapsulates the construction-time operations required to initialize a CellProcessor cellular process runtime host environment.",

    inputFilterSpec: require("./iospecs/cp-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/cp-method-constructor-output-spec"),

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
                errors.push(JSON.stringify(cellmodel));
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

            let ocdTemplateSpec = {  ____types: "jsObject" };
            ocdTemplateSpec[cpmMountingNamespaceName] = {};

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

                ocdTemplateSpec[apmProcessesNamespace] = {
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
            const cpAPMID =  arccore.identifier.irut.fromReference(`${request_.id}_CellProcess_AbstractProcessModel`).result;

            const cpCM = new CellModel({
                id: cpCMID,
                name: `${cpName} Cell Processor`,
                description: `Manages the lifespan of cell processes executing in the ${cpName} CellProcessor runtime host instance.`,
                apm: {
                    id: cpAPMID,
                    name: `${cpName} Cell Process Manager`,
                    description: `Defines shared memory and stateful behaviors for ${cpName} CellProcessor runtime host instance.`,
                    ocdDataSpec: {
                        ____types: "jsObject",
                        ____defaultValue: {},
                        cellProcessDigraph: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            runtime: { ____accept: [ "jsUndefined", "jsObject" ] },
                            serialized: { ____accept: [ "jsUndefined", "jsObject" ] }
                        }
                    },
                    steps: {
                        uninitialized: {
                            description: "Default starting step of a cell process.",
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "initializing" }
                            ]
                        },
                        initializing: {
                            description: "CellProcessor manager process is initializing.",
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "ready" }
                            ],
                            actions: {
                                enter: [
                                    { holarchy: { CellProcessor: { initialize: { }}}}
                                ]
                            }
                        },
                        ready: {
                            description: "CellProcessor manager process is ready to accept commands and queries."
                        }
                    }
                },
                actions: CellProcessorIntrinsics.actions,
                subcells: [
                    HolarchyCore,
                    request_.cellmodel
                ]
            });

            if (!cpCM.isValid()) {
                errors.push(JSON.stringify(cpCM));
                break;
            }

            ocdTemplateSpec[ "x7pM9bwcReupSRh0fcYTgw_CellProcessor" ] = {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { apm: cpAPMID }
            };

            // Now instantiate an ObservableProcessController runtime host instance using configuration derived from the Cell Processor's model.

            let innerResponse;

            innerResponse = cpCM.getCMConfig({ type: "APM" });
            if (innerResponse.error) {
                errors.push(InnerResponse.errror);
                break;
            }
            const cpFinalAPM = innerResponse.result;

            innerResponse = cpCM.getCMConfig({ type: "TOP" });
            if (innerResponse.error) {
                errors.push(InnerResponse.errror);
                break;
            }
            const cpFinalTOP = innerResponse.result;

            innerResponse = cpCM.getCMConfig({ type: "ACT" });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const cpFinalACT = innerResponse.result;

            const cpOPC = new ObservableProcessController({
                id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcessor_ObservableProcessController`).result,
                name: `${cpName} Observable Process Controller`,
                description: `Provides shared memory and runtime automata process orchestration for ${cpName} CellProcessor-resident cell processes.`,
                ocdTemplateSpec,
                abstractProcessModelSets: [ cpFinalAPM ],
                transitionOperatorSets: [ cpFinalTOP ],
                controllerActionSets: [ cpFinalACT ]
            });

            if (!cpOPC.isValid()) {
                errors.push(JSON.stringify(cpOPC));
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
