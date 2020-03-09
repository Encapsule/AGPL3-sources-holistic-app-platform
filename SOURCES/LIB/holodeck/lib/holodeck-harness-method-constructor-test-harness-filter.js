// holodeck-method-constructor-test-harness-filter.js

const arccore = require("@encapsule/arccore");

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

            const harnessFilterContext = {
                ...message.harnessOptions
            };

            // TODO: All constructed harness filters have some common I/O responsibilities imposed by holodeck.
            // Need to get this straight and nailed into the mix from the outset...
            const innerFactorResponse = arccore.filter.create({
                operationID: message.id,
                operationName: message.name,
                operationDescription: message.description,
                // TODO: specs - THESE ARE SYNTHESIZED
                bodyFunction: message.harnessBodyFunction
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
