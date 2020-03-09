// holodeck-harness-method-constructor-config-harness-filter.js

const arccore = require("@encapsule/arccore");
const harnessFilterBaseInputSpec = require("./iospecs/holodeck-harness-filter-base-input-spec");

const factoryResponse = arccore.filter.create({
    operationID: "TTKPNaovTSCFN8T-K3oYEA",
    operationName: "HolodeckHarness::constructor Config Harness Factory",
    operationDescription: "A filter that constructs a HolodeckHarness filter for modifying the configuration of a subsequently evaluated harnesses in the MDR-pattern dispatch chain.",

    inputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-config-harness-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"), // normalized for all harness types

    bodyFunction: (harnessCreateRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = harnessCreateRequest_.createConfigHarness;

            // TODO: All constructed harness filters have some common I/O responsibilities imposed by holodeck.
            // Need to get this straight and nailed into the mix from the outset...

            const innerFactoryResponse = arccore.filter.create({
                operationID: message.id,
                operationName: `Config Harness: ${message.name}`,
                operationDescription: message.description,
                inputFilterSpec: {
                    ...harnessFilterBaseInputSpec,
                    ...message.configRequestInputRequest
                },
                bodyFunction: message.harnessBodyFunction
            });
            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }

            response.result = {
                harnessType: "test-config-harness",
                harnessFilter: innerFactoryResponse.result
            };

            break;
        }
        if (errors.length) {
            reponse.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryReponse.error);
}

module.exports = factoryResponse.result;
