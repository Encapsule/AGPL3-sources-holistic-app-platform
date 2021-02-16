// ControllerAction-ObservableValueHelper-step-worker.js


(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmLabel = require("./cm-label-string");
    const cmasResponse = cmasHolarchyCMPackage.makeSubspaceInstance({ spaceLabel: cmLabel });
    if (cmasResponse.error) {
        throw new Error(cmasResponse.error);
    }
    const cmasObservableValueHelper = new holarchy.CellModelArtifactSpace(cmasResponse.result);

    const lib = require("./lib");

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueHelper.mapLabels({ ACT: "stepWorker" }).result.ACTID,
        name: `${cmLabel} Step Worker`,
        description: `Private evaluation implementation action of ${cmLabel}.`,
        actionRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                cm: {
                    ____types: "jsObject",
                    actions: {
                        ____types: "jsObject",
                        ValueObserver: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                stepWorker: {
                                    ____types: "jsObject",
                                    action: {
                                        ____accept: "jsString",
                                        ____inValueSet: [ "noop" ]
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
            return { error: null };
        }
    });
    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }
    module.exports = action;
})();

