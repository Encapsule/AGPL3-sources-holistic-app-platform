// PROJECT/PLATFORM/PACKAGES/holarchy-sml.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "@encapsule/holarchy standard model library contains reusable ObservableProcessModels, TransitionOperators, ControllerActions, and shared OCD template specs.",
        keywords: [ "Encapsule" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version
        }
    },
    packageReadme: {
        summaryDescriptor: {
            heading: undefined,
            markdown: []
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: []
        },
        bodySections: []
    }
};
