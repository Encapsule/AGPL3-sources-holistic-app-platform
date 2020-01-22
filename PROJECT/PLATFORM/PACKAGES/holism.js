// PROJECT/PACKAGES/holism.js

const arccore = require('@encapsule/arccore');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains an experimental HTTP 1.1 application server and REST framework derived from the Node.js HTTP API's and the @encapsule/arccore filter RTL. This provides developers with a simple mechanism to define and re-use backend operations as plug-in service filters hosted by the holism server RTL. The package is intended for use in derived applications and services.",
        keywords: [ "Encapsule", "holistic", "holism", "HTTP", "REST", "filter", "server", "framework", "node.js", "plug-in", "declarative" ],
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
