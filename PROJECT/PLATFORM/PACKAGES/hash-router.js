// PROJECT/PACKAGES/hash-router.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "A collection of reusable React components compatible with @encapsule/d2r2 <ComponentRouter/>.",
        keywords: [ "HTML5", "browser", "client", "hash", "router" ],
        license: "MIT",
        main: "minimal-hash-router.js"
    },

    packageReadme: {
        summaryDescriptor: {
            heading: "# Summary Descriptor Heading 1",
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
        documentationDescriptor: {
            heading: "# Documentation Descriptor Heading 1",
            markdown: [
                "blah blah blah Reusable React components for blah blah blah."
            ]
        },
        bodySections: []
    }

};