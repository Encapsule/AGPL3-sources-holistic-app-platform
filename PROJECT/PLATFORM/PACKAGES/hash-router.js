// PROJECT/PACKAGES/hash-router.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains a minimal client-side hash router implementation that is designed to be integrated into higher-level abstractions. For example, a re-usable ObservableProcessModel (OPM).",
        keywords: [ "HTML5", "browser", "client", "hash", "router" ],
        license: "MIT",
        main: "minimal-hash-router.js"
    },

    packageReadme: {
        overviewDescriptor: {
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
