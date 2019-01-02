// redis-user-account-descriptor-filter.js

const arccore = require('arccore');
const storageuserAccountDescriptorSpec = require('../common/iospecs/app/storage-user-account-descriptor-spec');

var factoryResponse = arccore.filter.create({
    operationID: "xRH64sseQRiBtG0SEYVNNA",
    operationName: "Redis User Account Descriptor Filter",
    operationDescription: "Validates/normalizes persisted user account descriptor stored in Redis.",
    outputFilterSpec: storageuserAccountDescriptorSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

