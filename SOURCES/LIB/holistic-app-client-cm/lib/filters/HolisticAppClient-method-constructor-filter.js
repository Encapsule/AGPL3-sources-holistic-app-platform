// HolisticAppClientService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "Jrc6uiRXS-aCNcQEDNcTug",
    operationName: "HolisticAppClientService::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppClientService::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec: require("./iospecs/HolisticAppClient-method-constructor-filter-input-spec"),
    outputFilterSpec: require("./iospecs/HolisticAppClient-method-constructor-filter-output-spec"),
    bodyFunction: function(request_) {
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
