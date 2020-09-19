
const arccore = require("@encapsule/arccore");
const holodeck = require("@encapsule/holodeck");

const holodeckPackageHarnesses = require("../holodeck/harnesses");
const holodeckPackageVectorSets = require("./holodeck-package-tests/vector-sets");

const holarchyPackageHarnesses = require("../holarchy/harnesses");
const holarchyPackageVectorSets = require("./holarchy-package-tests/vector-sets");

const holarchyCMPackageVectorSets = require("./holarchy-cm-package-tests/vector-sets");

const holisticAppClientCMVectorSets = require("./holistic-app-client-cm-package-tests/vector-sets");
const holisticAppServerCMVectorSets = require("./holistic-app-server-cm-package-tests/vector-sets");
const holisticAppCommonCMVectorSets = require("./holistic-app-common-cm-package-tests/vector-sets");

const mkdirp = require("mkdirp");

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
        },
        testRunnerOptions: {
            ____types: "jsObject",
            ____defaultValue: {},
            onlyExecuteVectors: {
                ____types: [ "jsNull", "jsArray" ],
                ____defaultValue: null,
                vectorId: {
                    ____accept: "jsString"
                }
            }
        }
    },
    outputFilterSpec: {
        ____label: "Holistic Platform Holodeck Runner Filter",
        ____accept: "jsObject"
    },
    bodyFunction: function(request_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            mkdirp(request_.logsDirectory);

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
                testRunnerOptions: request_.testRunnerOptions,
                testRequestSets: [
                    ...holodeckPackageVectorSets,
                    ...holarchyPackageVectorSets,
                    ...holarchyCMPackageVectorSets,
                    ...holisticAppClientCMVectorSets,
                    ...holisticAppServerCMVectorSets,
                    ...holisticAppCommonCMVectorSets
                ]
            });
            if (runnerResponse.error) {
                errors.push(runnerResponse.error);
                break;
            }
            response.result = runnerResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
