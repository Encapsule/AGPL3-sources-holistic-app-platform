// ControllerAction-ObservableValueHelper-step-worker.js


(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmLabel = require("./cell-label");
    const cmasResponse = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: cmLabel });
    if (cmasResponse.error) {
        throw new Error(cmasResponse.error);
    }
    const cmasObservableValueHelper = new holarchy.CellModelArtifactSpace(cmasResponse.result);

    const actionName = `${cmLabel}::stepWorker`;

    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueHelper.mapLabels({ ACT: "stepWorker" }).result.ACTID,
        name: actionName,
        description: `Private evaluation implementation action of ${cmLabel}.`,
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ObservableValueHelper: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                stepWorker: {
                                    ____types: "jsObject",
                                    action: {
                                        ____accept: "jsString",
                                        ____inValueSet: [
                                            "noop",
                                            "apply-configuration"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____accept: "jsString",
            ____defaultValue: "okay"
        },
        bodyFunction: function(actionRequest_) {

            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValueHelper._private.stepWorker;

                /*
                let actResponse = actionRequest_.context.act({
                    actorName: actionName,
                    actorTaskDescription: "Attempting CPM cell query...",
                    actionRequest: { CellProcessor: { cell: { query: {}, cellCoordinates: actionRequest_.context.apmBindingPath } } },
                    apmBindingPath: actionRequest_.context.apmBindingPath
                });

                if (actResponse.error) {
                    console.log(actResponse.error);
                }
                */

                let libResponse = lib.getStatus.request(actionRequest_.context);
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }

                let { cellMemory } = libResponse.result;

                console.log(`> Dispatching ObservableValueHelper::stepWorker action ${messageBody.action}...`);

                let actResponse, ocdResponse;

                switch (messageBody.action) {

                case "noop":
                    break;

                case "apply-configuration":

                    actResponse = actionRequest_.context.act({
                        actorName: actionName,
                        actorTaskDescription: "Activating an ObservableValueWorker cell to maintain the link.",
                        actionRequest: {
                            CellProcessor: {
                                process: {
                                    processCoordinates: {
                                        apmID: cmasHolarchyCMPackage.mapLabels({ APM: "ObservableValueWorker" }).result.APMID,
                                        instanceName: actionRequest_.context.apmBindingPath // We know this is unique within the neighborhood of cells that may occupy our CellProcessor's cellplane. So this guarantees that the ObversableValueWorker instance is unique and dedicated to serving this ObservableValueHelper cell.
                                    },
                                    activate: {
                                        processData: {
                                            configuration: {
                                                observableValueHelper: {
                                                    apmBindingPath: actionRequest_.context.apmBindingPath
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (actResponse.error) {
                        errors.push(actResponse.error);
                        break;
                    }

                    ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: "#._private.observableValueWorker" });
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }

                    break;


                default:
                    errors.push(`Internal error - unhandled switch case "${messageBody.action}".`);
                    break;
                }

                if (errors.length) {
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
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;
})();

