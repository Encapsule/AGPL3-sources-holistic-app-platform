// ControllerAction-ObservableValueHelper-configure.js



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

    const apmValueObserver = require("./AbstractProcessModel-value-observer");
    const configurationDataSpec = { ...apmValueObserver._private.declaration.ocdDataSpec.configuration };
    delete configurationDataSpec.____defaultValue;

    const action = new holarchy.ControllerAction({
        id: cmasObservableValueHelper.mapLabels({ ACT: "configure" }).result.ACTID,
        name: `${cmLabel} Configure`,
        description: `Allows an actor to configure / reconfigure the ${cmLabel} cell process.`,
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
                            configure: {
                                ...configurationDataSpec
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

