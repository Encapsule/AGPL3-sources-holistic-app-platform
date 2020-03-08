// holodeck-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "1WWlhU6aQ4WtF9puW3ujfg",
    operationName: "Holodeck::constructor Method Filter",
    operationDescription: "Intializes the internal state of a new Holodeck class instance.",
    inputFilterSpec: require("./iospecs/holodeck-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-method-constructor-output-spec"),
    bodyFunction: (constructorRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Add intrinsic holodeck harness filters.


            let innerResponse = arccore.discriminator.create({
                options: { action: "getFilter" }, // arccore.discriminator will return a reference to the only filter that might accept your request
                filters: constructorRequest_.holodeckHarnesses
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            response.result = {
                ...constructorRequest,
                holodeckHarnessDispatcher: innerResponse.result
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
