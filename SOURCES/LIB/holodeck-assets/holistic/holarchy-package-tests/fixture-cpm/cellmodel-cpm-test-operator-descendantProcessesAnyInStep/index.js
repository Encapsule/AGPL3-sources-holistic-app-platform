// cellmodel-cpm-test-operator-descendantProcessesAnyInStep/index.js

const holarchy = require("@encapsule/holarchy");
const holarchyCML = require("@encapsule/holarchy-cm").cml;

const cellModel = new holarchy.CellModel({
    id: "xbaDltz5S2m7Wes94Kx2pQ",

    name: "CPM Descendant Processes Any In Step Operator Test Model",
    description: "A model to test CPM descendant processes any in step operator.",
    apm: {
        id: "TR7suTjQSKOBK5bGKztIcg",
        name: "CPM Descendant Processes Any In Step Test Process",
        description: "A process to test CPM descendant processes any in step operator."
    }
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
