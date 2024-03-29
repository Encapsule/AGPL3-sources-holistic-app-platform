// cpp-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "BiBucvx-R7aop0g_CSzw_Q",
    operationName: "CellProcessPlane::constructor Filter",
    operationDescription: "Filters request descriptor object passed to CellProcessPlane constructor function.",
    inputFilterSpec: require("./iospecs/ct2p-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/ct2p-method-constructor-output-spec"),
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

