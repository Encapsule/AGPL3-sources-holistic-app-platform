// PROJECT/PACKAGES/d2r2.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "This package contains the Data-Driven React Router (d2r2) component factory extension for React. And, the ComponentRouter dynamic view compositor packaged as a generic React component. Used to build extensible view templates, and decoupled view libraries.",
        keywords: [ "Encapsule", "React", "ComponentRouter", "discriminator", "render", "filter", "d2r2", "layout", "template" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "react": holisticPlatformManifest.dependencies.common["react"],
            "react-dom": holisticPlatformManifest.dependencies.common["react-dom"]
        }
    },

    packageReadme: {

        bodySections: [

            {
                markdown: [
                    "**TODO**"

                ]
            }

        ]
    }

};
