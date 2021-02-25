// ControllerAction-ObservableValueWorker-read.js

/*
  This action reads the actual type-specialized Observable Value cell's value and version mailbox.
  The action will return response.error if:
  - The ObservableValueHelper cell is not linked (configured) so that it can communicate w/whichever cell process provides the ObservableValue of interest.
  - The ObservableValue of interest has actually been activated by its providing cell process.
*/

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueWorker = require("./cmasObservableValueWorker");
    const cmLabel = require("./cell-label");
    const actionName = `${cmLabel} Read Value`;
    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueWorker.mapLabels({ ACT: "read" }).result.ACTID,
        name: actionName,
        description: "Reads the type-specialized ObservableValue cell's value and version mailbox descriptor value.",
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
                                read: {
                                    ____types: "jsObject"
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: {
            ____label: `${actionName} Result`,
            ____types: "jsObject",
            value: {
                ____label: "Value",
                ____opaque: true // We do not know and we do not care at this level if this valid or what it even means.
            },
            revision: {
                ____label: "Revision",
                ____accept: "jsNumber"
            }
        },
        bodyFunction: function(actionRequest_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: "#.__apmiStep"});
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmiStep = ocdResponse.result;
                if (apmiStep !== "observable-value-worker-proxy-connected") {
                    response.result = { revision: -3 /* not linked */ };
                    break;
                }
                ocdResponse = actionRequest_.context.ocdi.readNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: "#.ovCell"});
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }

                const { path, lastReadRevision } = ocdResponse.result;

                // Now, actually query the ObservableValue cell for its current value mailbox descriptor.
                const actResponse = actionRequest_.context.act({
                    actorName: actionName,
                    actorTaskDescription: "Delegating the ObservableValue read request to the target ObservableValue cell...",
                    actionRequest: { // <- start CellProcessor delegate request
                        CellProcessor: {
                            cell: {
                                cellCoordinates: "#.ovcpProviderProxy",
                                delegate: {
                                    actionRequest: { // <- start CellProcessProxy action request
                                        holarchy: {
                                            CellProcessProxy: {
                                                proxy: {
                                                    actionRequest: { // <- start the request to send to the cell process the proxy is connected to, the provider cell process...
                                                        holarchy: {
                                                            common: {
                                                                actions: {
                                                                    ObservableValue: {
                                                                        readValue: {
                                                                            path
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: actionRequest_.context.apmBindingPath
                });

                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                // FIX FOR THIS SHOULD BE IN CPP PROXY ACTION
                response.result = actResponse.result.actionResult.actionResult; // TODO: Look into this. I believe that CPP proxy action should act like CPM delegate ;-)

                // Update the ObservableValueWorker cell's lastReadRevision value.
                ocdResponse = actionRequest_.context.ocdi.writeNamespace({ apmBindingPath: actionRequest_.context.apmBindingPath, dataPath: "#.ovCell.lastReadRevision" }, response.result.revision);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
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
