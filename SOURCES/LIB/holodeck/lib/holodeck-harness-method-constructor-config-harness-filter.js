// holodeck-harness-method-constructor-config-harness-filter.js

const arccore = require("@encapsule/arccore");

const harnessFilterBaseInputSpec = require("./iospecs/holodeck-harness-filter-base-input-spec");
const harnessType = "config-harness";

const factoryResponse = arccore.filter.create({
    operationID: "TTKPNaovTSCFN8T-K3oYEA",
    operationName: "Config Harness Factory",
    operationDescription: "Constructs a holodeck harness plug-in filter specialized for configuration programData.",

    inputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-config-harness-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"), // normalized for all harness types

    bodyFunction: (harnessCreateRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = harnessCreateRequest_.createConfigHarness;


            const innerFactoryResponse = arccore.filter.create({
                operationID: message.id,
                operationName: `Config Harness: ${message.name}`,
                operationDescription: message.description,

                // TODO: NO OUTPUT SPEC?
                inputFilterSpec: {
                    ____label: `Config Harness ${message.name} Request`,
                    ...harnessFilterBaseInputSpec,
                    programData: {
                        ...message.programRequestSpec
                    }
                },

                bodyFunction: message.harnessBodyFunction

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
            reponse.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryReponse.error);
}

module.exports = factoryResponse.result;
