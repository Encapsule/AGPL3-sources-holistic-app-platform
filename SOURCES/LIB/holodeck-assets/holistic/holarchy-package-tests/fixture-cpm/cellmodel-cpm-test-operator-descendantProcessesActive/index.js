// cellmodel-cpm-test-operator-descendantProcessesActive.js

const holarchy = require("@encapsule/holarchy");
const holarchyCML = require("@encapsule/holarchy-cm").cml;

const cellModel = new holarchy.CellModel({
    id: "L0L3o-vqTOOli8Lio96e8w",
    name: "CPM Descendant Processes Active Operator Test Model",
    description: "A model to test the descendant processes active operator.",

    apm: {
        id: "cYpoxyyZSwm19CqH3v7eLQ",
        name: "CPM Descendant Processes Active Operator Test Process",
        description: "A process to test the descendant processes active operator.",
    },

    subcells: [
        require("../cellmodel-dummy-A"),
        holarchyCML
    ]

});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
