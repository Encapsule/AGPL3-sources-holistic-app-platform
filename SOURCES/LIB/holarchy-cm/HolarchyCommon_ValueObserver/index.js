// HolarchyCommon_ValueObserver/index.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const cellID = arccore.identifier.irut.fromReference("@encapsule/holarchy-cm.ValueObserver.CellModel").result;
    const apmID = arccore.identifier.irut.fromReference("@encapsule/holarchy-cm.ValueObserver.AbstractProcessModel").result;

    const cellmodel = new holarchy.CellModel({
        id: cellID,
        name: "ValueObserver Model",
        description: "Provides a generic way to evaluate transition operators and perform actions on an ObservableValue cell.",
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

