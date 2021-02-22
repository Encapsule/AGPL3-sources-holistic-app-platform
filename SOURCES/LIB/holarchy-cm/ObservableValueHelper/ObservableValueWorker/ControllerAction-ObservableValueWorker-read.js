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
            ____accept: "jsString",
            ____defaultValue: "okay"
        },
        bodyFunction: function(actionRequest_) {
            return { error: null }; // TODO
        }
    });

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;

})();
