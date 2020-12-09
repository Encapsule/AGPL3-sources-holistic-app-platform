// HolisticAppServerService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const { HolisticAppCommon } = require("@encapsule/holistic-app-common-cm");

const factoryResponse = arccore.filter.create({
    operationID: "365COUTSRWCt2PLogVt51g",
    operationName: "HolisticAppServer::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppServer::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec: require("./iospecs/HolisticAppServer-method-constructor-filter-input-spec"),
    outputFilterSpec: require("./iospecs/HolisticAppServer-method-constructor-filter-output-spec"),
    bodyFunction: function(request_) {
        let response = {
            error: null,
            result: {
            }
        };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const appServiceCore = (request_.appServiceCore instanceof HolisticAppCommon)?request_.appServiceCore:new HolisticAppCommon(request_.appServiceCore);
            if (!appServiceCore.isValid()) {
                errors.push("Invalid appServiceCore value cannot be resolved to valid HolisticAppCommon class instance:");
                errors.push(response.result.appServiceCore.toJSON());
                break;
            }
            response.result.appServiceCore = appServiceCore;





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
