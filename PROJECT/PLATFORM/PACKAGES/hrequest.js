// PROJECT/PACKAGES/hrequest.js

const arccore = require('@encapsule/arccore');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains arccore.filter wrappers for XMLHttpRequest (browser) and the request module (Node.js server). Provides a mechanism to ensure the runtime fidelity of HTTP GET/POST communication between the client and server. And, between the server and other backend REST service integrations.",
        keywords: [ "HTTP", "request", "filter", "node", "browser", "Encapsule" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "query-string": "^6.2.0",
            request: "^2.88.0"
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
		"_Replace with hrequest package overview._"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "_Replace with hrequest package documentation._"
		]
	    }
        ]
    }
};
