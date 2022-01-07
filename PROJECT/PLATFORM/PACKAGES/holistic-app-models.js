// PROJECT/PLATFORM/PACKAGES/holistic-app-models.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "This package contains a collection of optional application and service models that may be resused to build holistic-powered runtimes.",
        keywords: [ "Encapsule", "holistic", "holarchy", "CellModel" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "react": react.version,
            "react-dom": react.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
                "@encapsule/holistic-app-models a runtime-library (RTL) distribution package that provides re-usable application and service level models useful for building derived applictions.",
	        ]
        },
        bodySections: [
	        {
		        markdown: [
                    "### Body Sections TODO"
		        ]
	        }
	    ]
    }
};
