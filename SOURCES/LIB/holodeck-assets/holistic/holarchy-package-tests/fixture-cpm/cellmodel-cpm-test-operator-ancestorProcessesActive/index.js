// cellmodel-cpm-test-operator-ancestorProcessesActive/index.js

const holarchy = require("@encapsule/holarchy");
const holarchyCML = require("@encapsule/holarchy-cm").cml;

const cellModel = new holarchy.CellModel({
    id: "eu32xBRTSE2-B71HrwPFBg",
    name: "CPM Ancestor Processes Active Operator Test Model",
    description: "A model to test CPM ancestor active operator.",
    apm: {
        id: "hybdu0VoQjWnOFs5vC3Tzw",
        name: "CPM Ancestor Processes Active Operator Test Process",
        description: "A process to test CPM ancestor active operator."
    }

});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
