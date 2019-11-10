// harness-filter-1.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "hzFRPBzOT1CgOuCaVffNRQ",

    inputFilterSpec: {
        ____types: "jsObject",
        filter1: {
            ____types: "jsObject",
            message: { ____accept: "jsString" }
        }
    },

    bodyFunction: function(request_) {

        console.log(`Filter1: ${request_.filter1.message}`);
        return { error: null };

    }


});

if (factoryResponse.error) {
    throw new Error(factoryRespnse.error);
}

module.exports = factoryResponse.result;

