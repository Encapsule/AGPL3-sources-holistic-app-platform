// holodeck-method-constructor-test-harness-filter.js

const arccore = require("@encapsule/arccore");

const harnessFilterBaseInputSpecGenerator = require("./iospecs/holodeck-harness-filter-input-spec-generator");
const harnessFilterBaseOutputSpecGenerator = require("./iospecs/holodeck-harness-filter-output-spec-generator");

const harnessType = "test-harness";

const factoryResponse = arccore.filter.create({

    operationID: "M054odK1Ti-YSkoYv5OzSA",
    operationName: "HolodeckHarness::constructor Test Harness Factory",
    operationDescription: "A filter that constructs a HolodeckHarness filter for executing a specific class of holodeck test vector.",

    inputFilterSpec:  require("./iospecs/holodeck-harness-method-constructor-test-harness-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"), // normalized for all harness types

    bodyFunction: (testHarnessCreateRequest_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = testHarnessCreateRequest_.createTestHarness;

            // ----------------------------------------------------------------
            // CREATE THE TEST HARNESS FILTER
            const innerFactorResponse = arccore.filter.create({

                operationID: message.id,
                operationName: `Test Harness: ${message.name}`,
                operationDescription: message.description,

                inputFilterSpec: harnessFilterInputSpecGenerator({ test: { ____types: "jsObject", ...message.testRequestSpec }}),
                outputFilterSpec: harnessFilterOutputSpecGenerator(message.testResultSpec),

                bodyFunction: (harnessRequest_) => {
                    let response = { error: null };
                    let errors = [];
                    let inBreakScope = false;
                    while (!inBreakScope) {
                        inBreakScope = true;

                        try {
                            let innerResponse = message.testBodyFunction

                        } catch (exception_) {

                        }

                        break;
                    }
                    if (errors.length) {
                        response.error = errors.join(" ");
                    }
                    return response;

                } // end bodyFunction

            });

            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }

            response.result = {
                harnessType,
                harnessFilter: innerFactoryResponse.result
            };


            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
