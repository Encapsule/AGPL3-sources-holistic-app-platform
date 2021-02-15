// ObservableValueHelper/index.js


(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmLabel = require("./cm-label-string");

    const cellmodel = new holarchy.CellModel({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: cmLabel,
        description: "Provides a generic means of linking to and subsequently reading from an active ObservableValue family member cell owned by another cell process.",
        apm: require("./AbstractProcessModel-value-observer"),

        actions: [
            require("./ControllerAction-value-observer-configure"),
            require("./ControllerAction-value-observer-step-worker")
        ]

    });

    if (!cellmodel.isValid()) {
        throw new Error(cellmodel.toJSON());
    }

    module.exports = cellmodel;

})();

