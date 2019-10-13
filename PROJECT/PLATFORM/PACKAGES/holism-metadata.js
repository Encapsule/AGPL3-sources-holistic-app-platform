// PROJECT/PACKAGES/holism-metadata.js

const arccore = require('@encapsule/arccore');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Library of service filter plug-ins for @encapsule/holism HTTP server and REST framework.",
        keywords: [ "Encapsule", "holism", "http", "metadata", "integration" ],

        license: "MIT",
        main: "metadata-store-constructor-factory.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version
        }
    },

    packageReadme: {
        summaryDescriptor: {
            heading: "# @encapsule/holism-metadata",
            markdown: [
                "TODO: write some documentation."
            ]
        },
        documentationDescriptor: {
            heading: "# Documentation Heading?",
            markdown: [
                "blah blah this is some text in the documentation markdown array."
            ]
        },
        bodySections: [
            {
                heading: "## Body section 1",
                markdown: [
                    "Hey this is a line of text"
                ]
            },
            {
                heading: "## Body section 2",
                markdown: [
                    "Hey this is a line of text."
                ]
            }
        ]
    }
};
