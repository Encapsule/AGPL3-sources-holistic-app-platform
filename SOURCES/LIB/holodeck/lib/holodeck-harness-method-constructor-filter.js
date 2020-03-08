// holodeck-harness-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "C5lUR1RmR6-No0DBG5DZaQ",
    operationName: "HolodeckHarness::constructor Filter",
    operationDescription: "Initializes the private state of a new HolodeckHarness instance.",
    inputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"),

    bodyFunction: (constructorRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
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
