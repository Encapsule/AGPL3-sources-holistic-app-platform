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
            heading: "### Optional package-specific description",
            markdown: [
                "This is a line of text terminated with a period but no newline.",
                "This is the next line in the content array also with no newline.",
                "This is the third line in a array. The supposition is that all three lines forms a single paragraph.",
                "\n\n",
                "The proceeding line has two newlines. This line terminates with a single newline.\n",
                "This is the next line following a line that terminates in newline. This line ends in two newlines.\n\n",
                "Lastly..."
            ]
        },
        bodySections: [
            {
                heading: "# Body Section 1",
                markdown: [
                    "Content line 1.",
                    "Content line 2."
                ]
            }
        ]
    }

};
