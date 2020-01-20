// PROJECT/PLATFORM/PACKAGES/holodeck-assets.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains re-usable test runners, harnesses, and vectors for use in conjunction with @encapsule/holodeck test infrastructure package.",
        keywords: [ "Encapsule", "holistic", "holodeck", "holodeck-assets", "test", "runner", "harness", "vector" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holodeck": holistic.version,
            "@encapsule/holarchy": holistic.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
		"_Replace with holodeck-assets package overview._"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "_Replace with holodeck-assets documentation._"
		]
	    }
	]
    }
};
