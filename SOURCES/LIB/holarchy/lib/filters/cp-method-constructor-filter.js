// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");
const CellProcessManager = require("../intrinsics/CellProcessManager");
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

            // Synthesize the filter specification to be used to configure the ObservableProcessController's shared memory ObservableControllerData store for this CellProcess instance.
            let ocdTemplateSpec = {  ____types: "jsObject" };

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
                    ____types: "jsObject",
                    ____asMap: true,
                    ____defaultValue: {},
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
                name: `Cell Process Manager ${cpName}`,
                description: `Cell process manager root process for CellProcessor ${cpName}.`,
                apm: {
                    id: cpAPMID,
                    name: `Cell Process Manager ${cpName}`,
                    description: `Cell process manager root process for CellProcessor ${cpName}.`,
                    ocdDataSpec: {
                        ____types: "jsObject",
                        ____defaultValue: {},
                        cellProcessDigraph: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            runtime: { ____accept: [ "jsUndefined", "jsObject" ] },
                            serialized: { ____accept: [ "jsUndefined", "jsObject" ] },
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
                actions: CellProcessManager.actions,
                subcells: [
                    HolarchyCore,
                    request_.cellmodel
                ]
            });

            if (!cpCM.isValid()) {
                errors.push(JSON.stringify(cpCM));
                break;
            }

            // Define the CellProcessor process manager process namespace in shared memory and bound our APM.
            // Note that we specifiy a default value here ensuring that the process manager cell process is
            // always started automatically whenever a CellProcess instance is constructed.
            ocdTemplateSpec[cpmMountingNamespaceName] = {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { apm: cpAPMID }
            };

            // Extract all the flattened artifact registrations from the synthesized Cell Process Manager CellModel
            // that are required to configure an ObservableProcessController runtime host instance to actually
            // execute all the cell processes created from all the CellModel APM's...

            configResponse = cpCM.getCMConfig();
            if (configResponse.error) {
                errors.push(configResponse.error);
                break;
            }

            const opcConfig = configResponse.result;

            // Now instantiate an ObservableProcessController runtime host instance using configuration derived from the Cell Processor's model.
            const cpOPC = new ObservableProcessController({
                id: arccore.identifier.irut.fromReference(`${request_.id}_CellProcessor_ObservableProcessController`).result,
                name: `${cpName} Observable Process Controller`,
                description: `Provides shared memory and runtime automata process orchestration for ${cpName} CellProcessor-resident cell processes.`,
                ocdTemplateSpec,
                abstractProcessModelSets: [ opcConfig.apm ],
                transitionOperatorSets: [ opcConfig.top ],
                controllerActionSets: [ opcConfig.act ]
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
