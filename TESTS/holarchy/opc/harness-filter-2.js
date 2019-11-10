// harness-filter-1.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "VX5VKFUSQ3WiYhMXXDUYJg",


    inputFilterSpec: {
        ____types: "jsObject",
        filter2: {
            ____types: "jsObject",
            message: { ____accept: "jsString" }
        }
    },

    bodyFunction: function(request_) {

        console.log(`Filter2: ${request_.filter1.message}`);
        return { error: null };

    }


});

if (factoryResponse.error) {
    throw new Error(factoryRespnse.error);
}

module.exports = factoryResponse.result;

