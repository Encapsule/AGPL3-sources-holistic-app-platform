// ObservableValueHelper/ObservableValueWorker/ControllerAction-ObservableValueWorker-step-worker.js

(function() {

    const holarchy = require("@encapsule/holarchy");

    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");
    const cmasObservableValueWorker = require("./cmasObservableValueWorker");

    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel}::stepWorker`;
    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueWorker.mapLabels({ APM: "stepWorker" }).result.APMID,
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
                        ObservableValueWorker: {
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

                const messageBody = actionRequest_.actionRequest.holarchy.common.actions.ObservableValueWorker._private.stepWorker;

                let libResponse = lib.getStatus.request(actionRequest_.context);
                if (libResponse.error) {
                    errors.push(libResponse.error);
                    break;
                }

                let { cellMemory } = libResponse.result;

                console.log(`> Dispatching ${actionName} action ${messageBody.action}...`);

                let actResponse, ocdResponse;

                switch (messageBody.action) {

                case "noop":
                    break;

                case "apply-configuration":

                    // Read the configuration data from our parent ObservableValueHelper cell (who activated us).
                    ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: cellMemory.configuration.observableValueHelper.apmBindingPath, dataPath: "#.configuration.observableValue" });
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }

                    const observableValueConfig = ocdResponse.result;

                    actResponse = actionRequest_.context.act({
                        actorName: actionName,
                        actorTaskDescription: "Attempting to connect proxy helper to the cell process that owns the ObservableValue family member cell we're attempting to link to.",
                        actionRequest: { CellProcessor: { proxy: { proxyCoordinates: "#.ovcpProviderProxy", connect: { processCoordinates: observableValueConfig.processCoordinates } } } },
                        apmBindingPath: actionRequest_.context.apmBindingPath
                    });

                    if (actResponse.error) {
                        // v0.0.52-tourmaline --- Report transport error on attempt to proxy to an unknown cell process coordinate.
                        // If we cannot establish a cell process proxy connection to it, then there's no possibility that we'll be
                        // able to access the ObservableValue cell on behalf of any other cell here.
                        errors.push(`Link request failed: ${cmLabel} cell instance "${actionRequest_.context.apmBindingPath}" failed to connect cell process proxy to the cell process expected to provide some ObservableValue due to error:`);
                        errors.push(actResponse.error);
                        break;
                    }

                    // Okay - so the CellProcessProxy connected w/out error. That's good.

                    const proxyConnectInfo = actResponse.result.actionResult;

                    // We need the apmBindingPath of the actual target ObservableValue cell now.
                    ocdResponse = holarchy.ObservableControllerData.dataPathResolve({ apmBindingPath: proxyConnectInfo.connected.apmBindingPath, dataPath: observableValueConfig.path });
                    if (ocdResponse.error) {
                        errors.push(ocdResponse.error);
                        break;
                    }

                    const ovCellPath = ocdResponse.result;

                    ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: "#.ovCell" }, { apmBindingPath: ovCellPath });
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

