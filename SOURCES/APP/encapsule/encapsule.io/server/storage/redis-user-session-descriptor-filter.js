// redis-user-session-descriptor-filter.js

const arccore = require('arccore');
const storageUserSessionDescriptorSpec = require('../../common/iospecs/app/storage-user-session-descriptor-spec');

var factoryResponse = arccore.filter.create({
    operationID: "7UZsOgo1Rz-V8UPMEvsMhA",
    operationName: "Redis User Session Descriptor Filter",
    operationDescription: "Validates/normalizes persisted user session descriptor stored in Redis.",
    outputFilterSpec: storageUserSessionDescriptorSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

