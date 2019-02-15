// PROJECT/PACKAGES/holism.js

const arccore = require('@encapsule/arccore');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Filter-extensible JSON-configured HTTP 1.1 REST framework for Node.js.",
        keywords: [ "HTTP", "REST", "filter", "server", "framework", "node", "Encapsule" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version
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
                "Developer API and examples: [Encapsule Project holism documentation](https://encapsule.io/docs/holism)"
            ]
        },
        bodySections: [
        ]
    }
};
