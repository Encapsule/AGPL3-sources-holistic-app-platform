// HolisticAppServerService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "365COUTSRWCt2PLogVt51g",
    operationName: "HolisticAppServerService::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppServerService::constructor function request descriptor object. And, returns the new instance's private state data.",
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
