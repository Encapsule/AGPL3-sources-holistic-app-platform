// PROJECT/PLATFORM/PACKAGES/holistic-app-client-cm.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "browser" ],
    packageManifestOverrides: {
        description: "Exports the HolisticAppClient CellModel library for use in derived HTML5 applications.",
        keywords: [ "Encapsule", "holistic", "holarchy", "CellModel" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "@encapsule/holarchy-cm": holistic.version,
            "react": react.version,
            "react-dom": react.version
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
