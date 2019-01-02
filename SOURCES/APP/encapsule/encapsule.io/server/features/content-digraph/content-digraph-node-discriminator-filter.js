// input-content-discriminator.js

const arccore = require('arccore');

const loaders = require('./loaders');

// Create an ARCcore.discriminator filter that routes its request to 1:N possible target filters.
var factoryResponse = arccore.discriminator.create({
    options: { action: 'routeRequest' },
    filters: loaders
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;


