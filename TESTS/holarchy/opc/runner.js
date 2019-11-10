
const arccore = require("@encapsule/arccore");

const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");


const outputDirectory = path.resolve(path.join(__dirname, "json-baseline"));
const inputDirectory = path.resolve(path.join(__dirname, "json-current"));

mkdirp(outputDirectory);
mkdirp(inputDirectory);


const factoryResponse = arccore.filter.create({

    operationID: "XkT3fzhYT0izLU_P2WF54Q",
    operationName: "Holarchy Test Runner",
    operationDescription: "Accepts an array of array of test request descriptors.",
    inputFilterSpec: {
        ____types: "jsObject",

        testHarnessFilters: {
            ____types: "jsArray",
            testHarnessFilter: { ____accept: "jsObject" }
        },

        testRequestSets: {
            ____types: "jsArray",
            testRequestSet: {
                ____types: "jsArray",
                testRequest: {
                    id: { ____accept: "jsString" },
                    name: { ____accept: "jsString" },
                    description: { ____accept: "jsString" },
                    harnessRequest: { ____accept: [ "jsUndefined", "jsObject" ] }
                }
            }
        }

    },

    bodyFunction: function(request_) {
        let response = { error: null, result: [] };

        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            console.log("> Initializing test harness dispatcher...");

            const factoryResponse = arccore.discriminator.create({
                options: { action: "routeRequest" },
                filters: request_.testHarnessFilters
            });

            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            const harnessDispatcher = factoryResponse.result;

            console.log("..... Test harness dispatcher initialized.");

            let dispatchCount = 0;

            console.log("> Reading test sets...");

            for (let setNumber = 0 ; setNumber < request_.testRequestSets.length ; setNumber++) {

                const testSet = request_.testRequestSets[setNumber];
                for (let testNumber = 0 ; testNumber < testSet.length ; testNumber++) {

                    console.log(`..... Dispatching test #${dispatchCount} - [${testRequest.id}::${testRequest.name}]`);

                    const testRequest = testSet[testNumber];
                    const testResponse = harnessDispatcher.request(testRequest);

                    const testEvalDescriptor = { testRequest, testResponse };
                    const testEvalDescriptorJSON = JSON.stringify(testEvalDescriptor, undefined, 4);
                    const testOutputFilename = path.join(outputDirectory, `test-${testRequest.id}.json`);
                    fs.writeFileSync(testOutputFilename, testEvalDescriptorJSON);

                    response.result.push(testEvalDescriptor);

                } // for testNumber

            } // for setNumber

            break;

        } // while (!inBreakScope)

        if (errors.length) {
            response.error = errors.join(" ");
        }

        const responseJSON = JSON.stringify(response, undefined, 4);

        fs.writeFileSync("./output.json", responseJSON);


        return response;
    },

    outputFilterSpec: { ____opaque: true }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result; // the test runner filter
