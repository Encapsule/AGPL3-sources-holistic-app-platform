// fixture-cpm-operators.js

const holarchy = require("@encapsule/holarchy");

const cellModel = new holarchy.CellModel({ // CellModel declaration
    id: "1jSxHMrqS6i9eDiRvDmfeg",
    name: "@encapsule/holarchy CellProcessor Test Model",
    description: "A wrapper for other CellModels defined to facilitate testing of the CellProcessor's intrinsic Cell Process Manager cell process operators and actions.",
    subcells: [
        require("./cellmodel-cpm-test-operator-childProcessesActive")
    ] // CPM Child Process Active Operator Test Model subcells
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;


