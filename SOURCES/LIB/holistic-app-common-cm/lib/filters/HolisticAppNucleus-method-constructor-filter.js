// HolisticAppCommonService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "P9-aWxR5Ts6AhYSQ7Ymgbg",
    operationName: "HolisticAppNucleus::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppNucleus::constructor function request object and returns the new instance's private state data.",
    inputFilterSpec: require("./iospecs/HolisticAppNucleus-method-constructor-filter-input-spec"),
    outputFilterSpec: require("./iospecs/HolisticAppNucleus-method-constructor-filter-output-spec"),

    bodyFunction: function(request_) {
        return { error: null, result: { test: "fake result" } }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;