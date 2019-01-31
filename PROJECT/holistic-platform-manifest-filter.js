// holistic-app-framework-manifest-filter.js

const arccore = require('arccore');
const packageMapSpec = require('./package-map-spec');

const factoryResponse = arccore.filter.create({
    operationID: "XzQWD4ivQLK6ycjwN2cFSQ",
    operationName: "Holistic Framework Manifest",
    operationDescription: "Used to verify and normalize a holistic framework manifest object that defines information pertinent to the creation of a holistic application's package.json manifest.",
    inputFilterSpec: {
	____label: "Holistic Framework Manifest",
	____description: "Describes information pertinent to the build, test, and packaging of web applications derived from the Encapsule/holistic framework.",
	____types: "jsObject",
	platformDependencies: packageMapSpec
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

