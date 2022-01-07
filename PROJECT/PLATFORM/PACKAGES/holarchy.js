// PROJECT/PLATFORM/PACKAGES/holarchy.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "Cellular process modeling and runtime engine for Node.js and browser.",
        keywords: [ "Encapsule", "holistic", "holarchy", "CellModel", "CellProcessor", "streaming", "filtering", "mind-fuck" ],
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
		"**TODO**"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "**TODO**"
		]
	    }
	]
    }
};
