// PROJECT/PACKAGES/d2r2-components.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "A collection of reusable React components compatible with @encapsule/d2r2's <ComponentRouter/>.",
        keywords: [ "Encapsule", "React", "ComponentRouter", "component", "components" ],

        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/d2r2": holisticBuild.version,
            "react": holisticPlatformManifest.platformDependencies["react"],
            "react-dom": holisticPlatformManifest.platformDependencies["react-dom"]
        },
        bin: {
            copy_resources: "./bin/copy_holarchy_resources.js"
        }
    },

    packageReadme: {
        summaryDescriptor: {
            heading: "# Boom",
            markdown: [
                "Yo...",
                "What is up?"
            ]
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: [
                "Reusable React components for d2r2."
            ]
        },
        bodySections: []
    }

};
