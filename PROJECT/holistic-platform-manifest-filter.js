// holistic-app-framework-manifest-filter.js

const arccore = require('arccore');
const devDependenciesSpec = require('./dev-dependencies-spec.js');

const factoryResponse = arccore.filter.create({
    operationID: "XzQWD4ivQLK6ycjwN2cFSQ",
    operationName: "Holistic Framework Manifest",
    operationDescription: "Used to verify and normalize a holistic framework manifest object that defines information pertinent to the creation of a holistic application's package.json manifest.",
    inputFilterSpec: {
	____label: "Holistic Framework Manifest",
	____description: "Describes information pertinent to the build, test, and packaging of web applications derived from the Encapsule/holistic framework.",
	____types: "jsObject",
	devDependencies: devDependenciesSpec
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

