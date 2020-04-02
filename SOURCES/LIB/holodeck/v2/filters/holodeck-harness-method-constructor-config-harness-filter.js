// holodeck-harness-method-constructor-config-harness-filter.js

const arccore = require("@encapsule/arccore");

const harnessFilterInputSpecGenerator = require("./iospecs/holodeck-harness-filter-input-spec-generator");
const harnessFilterOutputSpecGenerator = require("./iospecs/holodeck-harness-filter-output-spec-generator");

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

            // ----------------------------------------------------------------
            // CREATE THE CONFIG HARNESS FILTER
            const innerFactoryResponse = arccore.filter.create({

                operationID: message.id,
                operationName: `Config Harness: ${message.name}`,
                operationDescription: message.description,

                inputFilterSpec: harnessFilterInputSpecGenerator({ config: { ____types: "jsObject", ...message.configCommandSpec }}),
                outputFilterSpec: harnessFilterOutputSpecGenerator(message.configPluginResultSpec),

                bodyFunction: (harnessRequest_) => {
                    let response = { error: null };
                    let errors = [];
                    let inBreakScope = false;
                    while (!inBreakScope) {
                        inBreakScope = true;

                        try {
                            let innerResponse = message.configBodyFunction(harnessRequest_);
                            if (innerResponse.error) {
                                errors.push(innerResponse.error);
                                break;
                            }
                            response.result = innerResponse.result;

                        } catch (exception_) {
                            errors.push("Unhandled exception in config harness plug-in:");
                            errors.push(exception_.message);
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
