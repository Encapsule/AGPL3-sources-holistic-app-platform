
const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const holodeckPackageHarnesses = require("../holodeck/harnesses");
const holodeckPackageVectorSets = require("./holodeck-package-tests/vector-sets");

const holarchyPackageHarnesses = require("../holarchy/harnesses");
const holarchyPackageVectorSets = require("./holarchy-package-tests/vector-sets");

const factoryResponse = arccore.filter.create({
    operationID: "Ga_AZ-2HSHuB0uJ9l6n3Uw",
    operationName: "Holistic Test Runner Generator",
    operationDescription: "Filter that accepts config options and returns an @encapsule/holodeck runner filter instance.",
    inputFilterSpec: {
        ____label: "Holistic Test Runner Generator Request",
        ____description: "A request descriptor object containing config options.",
        ____types: "jsObject",
        logsDirectory: {
            ____label: "Holodeck Logs Directory",
            ____description: "Fully-qualified local filesystem path of the holodeck eval logs directory.",
            ____accept: "jsString"
        }
    },
    outputFilterSpec: {
        ____label: "Holistic Platform Holodeck Runner Filter",
        ____accept: "jsObject"
    },
    bodyFunction: function(request_) {
        // HOLODECK TEST RUNNER DEFINITION
        const runnerResponse = holodeck.runnerFilter.request({
            id: "TxK2RjDjS2mQLkm_N8b6_Q",
            name: "Holistic Platform Test Vectors",
            description: "A suite of test vectors for exploring and confirming the behaviors of Encapsule Project holistic app platform libraries.",
            logsRootDir: request_.logsDirectory,
            testHarnessFilters: [
                ...holodeckPackageHarnesses,
                ...holarchyPackageHarnesses
            ],
            testRequestSets: [
                ...holodeckPackageVectorSets,
                ...holarchyPackageVectorSets
            ]
        });
        if (runnerResponse.error) {
            console.error(`! Test runner returned an error: '${runnerResponse.error}'`);
        } else {
            console.log("Complete.");
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
