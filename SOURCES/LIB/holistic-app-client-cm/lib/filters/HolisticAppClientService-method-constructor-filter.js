// HolisticAppClientService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "Jrc6uiRXS-aCNcQEDNcTug",
    operationName: "HolisticAppClientService::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppClientService::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec: {
        ____opaque: true
    },
    outputFilterSpec: {
        ____accept: "jsObject" // TODO
    },
    bodyFunction: function(request_) {
        return { error: null, result: { test: "fake result" } }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
