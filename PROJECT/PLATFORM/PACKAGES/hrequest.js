// PROJECT/PACKAGES/hrequest.js

const arccore = require('arccore');
const arccoreVersion = arccore.__meta.version;

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "HTTP request filters for Node.js and browser clients.",
        keywords: [ "HTTP", "request", "filter", "node", "browser", "Encapsule" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            arccore: arccoreVersion,
            "query-string": "^6.2.0",
            request: "^2.88.0"
        }
    },
    packageReadme: {
        summaryDescriptor: {
            heading: undefined,
            markdown: []
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: [
                "Developer API and examples: [Encapsule Project hrequest documentation](https://encapsule.io/docs/hrequest)"
            ]
        },
        bodySections: [
        ]
    }
};
