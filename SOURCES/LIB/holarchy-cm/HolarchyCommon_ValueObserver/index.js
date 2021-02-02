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
        apm: {
            id: apmID,
            name: "ValueObserver Process",
            description: "A strongly-typed runtime intra-cell communication signal input.",
            ocdDataSpec: {
                ____types: "jsObject",
                ____defaultValue: {},

            },
            steps: {
                "uninitialized": {
                    description: "Default starting process step",
                    transitions: [ { transitionIf: { always: true }, nextStep: "value-observer-initialize" } ]
                },

                "value-observer-initialize": {
                    description: "The ValueObserver cell is intializing..."
                }
            }
        }

    });

    if (!cellmodel.isValid()) {
        throw new Error(cellmodel.toJSON());
    }

    module.exports = cellmodel;

})();

