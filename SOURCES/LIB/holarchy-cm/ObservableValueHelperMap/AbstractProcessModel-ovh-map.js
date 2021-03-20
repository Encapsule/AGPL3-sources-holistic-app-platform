// AbstractProcessModel-ovh-map.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const ovhCellModel = require("../ObservableValueHelper");

    const apm = new holarchy.AbstractProcessModel({
        id: cmasHolarchyCMPackage.mapLabels({ APM: cmLabel }).result.APMID,
        name: `${cmLabel} Process`,
        description: cmDescription,
        ocdDataSpec: {
            ____label: `${cmLabel} Cell Memory`,
            ____description: `Backing cell instance data for ${cmLabel} cell process.`,
            ____types: "jsObject",
            ____defaultValue: {},
            ovhMap: {
                ____label: "ObservableValueHelper Map",
                ____description: "An extensible map (object used as a dictionary) of ObservableValueHelper cell activations.",
                ____types: "jsObject",
                ____asMap: true,
                ____defaultValue: {},
                signalName: {
                    ____types: "jsObject",
                    ____appdsl: { apm: ovhCellModel.getAPM().getID() }
                }
            }
        }
    });

    if (!apm.isValid()) {
        throw new Error(apm.toJSON());
    }

    module.exports = apm;

})();

