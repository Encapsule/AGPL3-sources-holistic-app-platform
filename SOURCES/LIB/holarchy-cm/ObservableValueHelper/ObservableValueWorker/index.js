// ObservableValueHelper/ObservableValueWorker/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const cmLabel = require("./cell-label");

    const cellModel = new holarchy.CellModel({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: `${cmLabel} Model`,
        description: "Performs work on behalf a single ObservableValueHelper cell.",

        apm: require("./AbstractProcessModel-ObservableValueWorker"),

        actions: [
            require("./ControllerAction-ObservableValueWorker-read"),
            require("./ControllerAction-ObservableValueWorker-step-worker")
        ],

        operators: [
            require("./TransitionOperator-ObservableValueWorker-value-has-updated"),
            require("./TransitionOperator-ObservableValueWorker-value-is-active"),
            require("./TransitionOperator-ObservableValueWorker-value-is-available")
        ],

        subcells: [
        ]

    });


    if (!cellModel.isValid()) {
        throw new Error(cellModel.toJSON());
    }

    module.exports = cellModel;

})();

