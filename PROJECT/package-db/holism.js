// PROJECT/package-db/holism.js

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Filter-extensible JSON-configured HTTP 1.1 REST frameowrk for Node.js.",
        keywords: [ "HTTP", "REST", "filter", "server", "framework", "node", "Encapsule" ],
        license: "MIT",
        main: "index.js"
    },
    packageReadme: {
        DISABLE_summaryDescriptor: {
            heading: "## Custom summary section",
            markdown: [
                "This is test content in the Summary/Custom summary section"
            ]
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: [
                "Developer API and examples: [Encapsule Project holism documentation](https://encapsule.io/docs/holism)"
            ]
        },
        
        bodySections: [
            {
                heading: "# Custom body section",
                markdown: [
                    "This is some custom content in the first body section.",
                    "This is some additional content."
                ]
            },
            {
                heading: "# Another custom heading",
                markdown: [
                    "whatever",
                    "she decided to take a shortcut"
                ]
            }
        ]
    }
};
