// fixture-cpm-operators.js

const holarchy = require("@encapsule/holarchy");
const holarchyCM = require("@encapsule/holarchy-cm").cml;

module.exports = { // CellModel declaration
    id: "1jSxHMrqS6i9eDiRvDmfeg",
    name: "@encapsule/holarchy CellProcessor Test Model",
    description: "A wrapper for other CellModels defined to facilitate testing of the CellProcessor's intrinsic Cell Process Manager cell process operators and actions.",


    subcells: [

        require("./cpm-test-model-operator-childProcessesActive")



    ] // CPM Child Process Active Operator Test Model subcells

};

