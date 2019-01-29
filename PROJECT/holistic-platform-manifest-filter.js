// holistic-app-framework-manifest-filter.js

const arccore = require('arccore');

const factoryResponse = arccore.filter.create({
    operationID: "XzQWD4ivQLK6ycjwN2cFSQ",
    operationName: "Holistic Framework Manifest",
    operationDescription: "Used to verify and normalize a holistic framework manifest object that defines information pertinent to the creation of a holistic application's package.json manifest.",
    inputFilterSpec: {
	____label: "Holistic Framework Manifest",
	____description: "Describes information pertinent to the build, test, and packaging of web applications derived from the Encapsule/holistic framework.",
	____types: "jsObject",
	devDependencies: {
	    ____label: "Development Dependencies",
	    ____description: "A map of development dependency package names to semantic version strings that are required by the Encapsule/holistic " +
		"framework's build, packaging, test, and runtime infrastructure platform.",
	    ____types: "jsObject",
	    ____asMap: true,
	    packageName: {
		____label: "Package Dependency Version",
		____description: "The semantic version string or git repo specification of the source of the dependency package.",
		____accept: "jsString"
	    }
	}
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;

