// cp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const CellModel = require("../../CellModel");
const CellProcessManager = require("../intrinsics/CellProcessManager");
const HolarchyCore = require("../intrinsics/HolarchyCore");
const ObservableProcessController = require("../../lib/ObservableProcessController");
const cpmMountingNamespaceName = require("./cpm-mounting-namespace-name");

(function() {

    const filterDeclaration = {

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

                console.log("O       o O       o O       o");
                console.log("| O   o | | O   o | | O   o |");
                console.log("| | O | | | | O | | | | O | |");
                console.log("| o   O | | o   O | | o   O |");
                console.log("o       O o       O o       O");
                console.log(`CellProcessor::constructor [${request_.id}::${request_.name}] enter...`);
                console.log("> Configuring a contained ObservableProcessController instance to host this specific class of cellular runtime service...");

                const cpName = `${request_.name} Runtime Host`;

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
                        ____label: `${apmFilterName} Cell Processes Memory`,
                        ____description: `Shared cell process memory for cell processes bound to AbstractProcessModel ${apmFilterName}.`,
                        ____types: "jsObject",
                        ____defaultValue: {},
                        cellProcessMap: {
                            ____label: `${apmFilterName} Cell Process Map`,
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
                        },
                        revision: { ____accept: "jsNumber", ____defaultValue: 0 }
                    };

                } // end for apmConfig.length

                const cpAPMID =  arccore.identifier.irut.fromReference(`${request_.id}_CellProcessManager_AbstractProcessModel`).result;

                // Define the CellProcessor process manager process namespace in shared memory and bind our APM.
                // Note that we specifiy a default value here ensuring that the process manager cell process is
                // always started automatically whenever a CellProcess instance is constructed.
                ocdTemplateSpec[cpmMountingNamespaceName] = {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    ____appdsl: { apm: cpAPMID }
                };

                // Now create a new CellModel for the Cell Process Managager that will manage the data in the cpmMountingNamespaceName namespace.

                const cpCMID = arccore.identifier.irut.fromReference(`${request_.id}_CellProcessor_CellModel`).result;

                const cpCM = new CellModel({
                    id: cpCMID,
                    name: `${cpName} CellProcessManager`,
                    description: `Cell process manager root process for CellProcessor ${cpName}.`,
                    apm: {
                        id: cpAPMID,
                        name: `${cpName} Cell Process Manager`,
                        description: `Cell process manager root process for CellProcessor ${cpName}.`,
                        ocdDataSpec: {
                            ____label: "Cell Process Manager",
                            ____description: "Namespace reserved for storage of root cell process manager data structures. Access this information only via ControllerActions and TransitionOperators.",
                            ____types: "jsObject",
                            ____defaultValue: {},
                            ownedCellProcesses: {
                                ____label: "Owned Cell Processes Data",
                                ____description: "Data used by the CPM to track and manage the lifespan of cell processes tree created & destroyed w/the CPM process create & delete actions respectively.",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                revision: {
                                    ____label: "Owned Cell Processes Data Revision",
                                    ____description: "A monotonically-increasing counter value that is incremented every time a cell process is created or deleted via ControllerAction call.",
                                    ____accept: "jsNumber",
                                    ____defaultValue: 0
                                },
                                digraph: {
                                    ____label: "Owned Cell Processes Data Model",
                                    ____description: "A deserialized @encapsule/arccore.graph DirectedGraph class instance leveraged by the cell process manager action interface.",
                                    ____accept: [ "jsUndefined", "jsObject" ]
                                }
                            }, // ownedCellProcesses
                            sharedCellProcesses: {
                                ____label: "Shared Cell Processes Data",
                                ____description: "Data used by the CPM to track and manage the lifespan of reference-counted, shared, cell processes accessed via embedded helper cells that function as local in-cell-process proxies to other cell process(es).",
                                ____types: "jsObject",
                                ____defaultValue: {},
                                revision: {
                                    ____label: "Shared Cell Processes Data Revision",
                                    ____description: "A monotonically-increasing counter value that is incremented every time a shared cell process is created or deleted via ControllerAction call.",
                                    ____accept: "jsNumber",
                                    ____defaultValue: 0
                                },
                                digraph: {
                                    ____label: "Shared Cell Processes Data Model",
                                    ____description: "A deserialized @encapsule/arccore.graph DirectedGraph class instance leveraged by the cell process manager action interface.",
                                    ____accept: [ "jsUndefined", "jsObject" ]
                                }
                            } // sharedCellProcesses
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
                                actions: { enter: [ { CellProcessor: { _private: { initialize: {} } } } ] }
                            },
                            ready: {
                                description: "CellProcessor manager process is ready to accept commands and queries."
                            }
                        }
                    },
                    actions: CellProcessManager.actions,
                    operators: CellProcessManager.operators,
                    subcells: [
                        ...CellProcessManager.subcells,
                        HolarchyCore,
                        request_.cellmodel
                    ]
                });

                if (!cpCM.isValid()) {
                    errors.push(JSON.stringify(cpCM));
                    break;
                }

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
                    name: `${cpName} ObservableProcessController`,
                    description: `Provides generic shared memory and runtime evaluation services (aka \"cell plane") for '${cpName}' CellProcessor instance.`,
                    ocdTemplateSpec,
                    abstractProcessModelSets: [ opcConfig.apm ],
                    transitionOperatorSets: [ opcConfig.top ],
                    controllerActionSets: [ opcConfig.act ]
                });

                if (!cpOPC.isValid()) {
                    errors.push(JSON.stringify(cpOPC));
                    break;
                }

                response.result = { cm: cpCM, opc: cpOPC }; // Wow...

                break;

            } // end while

            if (errors.length) {
                errors.unshift("Cannot construct CellProcessor due to error:");
                response.error = errors.join(" ");
            }
            if (!response.error) {
                console.log("> ObservableProcessController instance initialized.");
                console.log("> CellProcessor cell runtime plane has been initialized and is ready for action(s).");
                console.log(`CellProcessor::constructor [${request_.id}::${request_.name}] exit.`);
                console.log("O       o O       o O       o");
                console.log("| O   o | | O   o | | O   o |");
                console.log("| | O | | | | O | | | | O | |");
                console.log("| o   O | | o   O | | o   O |");
                console.log("o       O o       O o       O");
            } else {
                console.log("> CellProcessor instance initialization FAILED.");
                console.log("> All subsequent calls to methods on this instance will return an response.error.");
                console.log(`CellProcessor::constructor [${request_.id}::${request_.name}] exit.`);
                console.error(response.error);
            }
            return response;
        }

    }; // filterDeclaration

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();
