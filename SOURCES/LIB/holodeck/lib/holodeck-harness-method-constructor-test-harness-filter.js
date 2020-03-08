// holodeck-method-constructor-test-harness-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "M054odK1Ti-YSkoYv5OzSA",
    operationName: "HolodeckHarness::constructor Test Harness Factory",
    operationDescription: "A filter that constructs a HolodeckHarness filter for executing a specific class of holodeck test vector.",

    inputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-test-harness-input-spec"),
    outputFilterSpec: require("./iospacs/holodeck-harness-method-constructor-test-harness-output-spec"),

    bodyFunction: (testHarnessCreateRequest_) {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = testHarnessCreateRequest_.createTestHarness;

            const harnessFilterContext = {
                ...message.harnessOptions
            };

            const innerFactorResponse = arccore.filter.create({
                operationID: message.id,
                operationName: message.name,
                operationDescription: message.description,
                // TODO: specs
                bodyFunction: message: harnessBodyFunction
            });
            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }



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
