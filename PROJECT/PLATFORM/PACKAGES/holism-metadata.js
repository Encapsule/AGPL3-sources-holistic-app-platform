// PROJECT/PACKAGES/holism-metadata.js

const arccore = require('@encapsule/arccore');

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node", "browser" ],
    packageManifestOverrides: {
        description: "This package contains an extensible framework for defining application-specific metadata - i.e. data about your app. It is intended for use in derived apps/services and is typically used in conjunction with @encapsule/holism integration plug-in filters to satisfy queries re: publishing organization, application, page, route, hashroute, resource, operation...",
        keywords: [ "Encapsule", "holism", "http", "metadata", "integration" ],

        license: "MIT",
        main: "metadata-store-constructor-factory.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version
        }
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
