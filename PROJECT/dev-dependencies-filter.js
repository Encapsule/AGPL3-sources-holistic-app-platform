// dev-dependencies-filter.js

const arccore = require('arccore');
const devDependenciesSpec = require('./dev-dependencies-spec');

const factoryResponse = arccore.filter.create({
    operationID: "kHkp4rgFSciQecriF4LglQ",
    operationName: "Development Dependencies Map",
    operationDescription: "Used to verify and normalize a map of package names to semantic version strings.",
    inputFilterSpec: devDependenciesSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


