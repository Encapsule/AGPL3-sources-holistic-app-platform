// cellmodel-cpm-test-operator-childProcessesAllInStep/index.js

const holarchy = require("@encapsule/holarchy");
const holarchyCML = require("@encapsule/holarchy-cm").cml;

const cellModel = new holarchy.CellModel({
    id: "OfLkkeNgQDm3xLb7TJqNRg",
    name: "CPM Child Processes All In Step Operator Test Model",
    description: "A model to test the CPM child processes all in step operator.",
    apm: {
        id: "vjz7U4NWRE2_UlAvAjmS6g",
        name: "CPM Child Processes All In Step Operator Test Process",
        description: "A model to test the CPM child processes all in step operator.",
    }
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
