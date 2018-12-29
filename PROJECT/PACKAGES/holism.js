// PROJECT/package-db/holism.js

const arccore = require('arccore');
const arccoreVersion = arccore.__meta.version;

const childProcess = require('child_process');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Filter-extensible JSON-configured HTTP 1.1 REST framework for Node.js.",
        keywords: [ "HTTP", "REST", "filter", "server", "framework", "node", "Encapsule" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            arccore: arccoreVersion
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
