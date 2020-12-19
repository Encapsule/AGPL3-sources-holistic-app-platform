// PROJECT/PLATFORM/PACKAGES/holistic-app-common-cm.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "Exports the HolisticAppCommon CellModel library for use in derived HolisticAppServer and HolisticAppClient CellModels.",
        keywords: [ "Encapsule", "holistic", "holarchy", "CellModel" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "@encapsule/holarchy-cm": holistic.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
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
