// PROJECT/PACKAGES/holism-services.js

const arccore = require('@encapsule/arccore');
const holistic = require("../../../BUILD/holistic");


module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains re-usable service filter plug-ins for use with the @encapsule/holism app server package.",
        keywords: [ "Encapsule", "holistic", "holism", "holism-services", "service", "service filter", "plug-in", "HTTP", "REST" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holism" : holistic.version
        }
    },

    packageReadme: {
        overviewDescriptor: {
            markdown: [
		"_Replace with holism-services overview._"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "_Replace with holism-services package documentation._"
		]
	    }
        ]
    }
};
