// PROJECT/PACKAGES/holism-services.js

const arccore = require('@encapsule/arccore');
const holistic = require("../../../BUILD/holistic");


module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Library of service filter plug-ins for @encapsule/holism HTTP server and REST framework.",
        keywords: [ "HTTP", "REST", "filter", "server", "service", "framework", "node", "Encapsule" ],

        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holism" : holistic.version
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
                "A small collection of useful [service filter](https://encapsule.io/docs/holism/services) plug-ins for [@encapsule/holism](https://encapsule.io/docs/holism)."
            ]
        },
        bodySections: [
        ]
    }
};
