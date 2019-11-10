// harness-filter-1.js

const arccore = require("@encapsule/arccore");
const assert = require("./chai-assert-fascade");

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

        return assert.isString(request_);

    }


});

if (factoryResponse.error) {
    throw new Error(factoryRespnse.error);
}

module.exports = factoryResponse.result;

