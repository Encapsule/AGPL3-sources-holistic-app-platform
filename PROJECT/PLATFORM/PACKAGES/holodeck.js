// PROJECT/PLATFORM/PACKAGES/holodeck.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains the holodeck test runner and test harness plug-in filter factory infrastructure. Holodeck functions like a medical imaging system for your code that bombards it with queries and captures the results to disk. Comparison of git diff's is often all that's required to verify the correct and expected behavior of updated app/service code tracked in this way.",

        keywords: [ "Encapsule", "holistic", "holodeck", "holodeck-assets", "test", "runner", "harness", "vector", "filter", "plug-in" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            heading: undefined,
            markdown: [
		"_Replace with holodeck package overview._"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "_Replace with holodeck package documentation_."
		]
	    }
	]
    }
};
