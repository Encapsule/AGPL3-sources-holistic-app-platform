// PROJECT/PLATFORM/PACKAGES/index.js
//
// Metadata declarations indexed by full package name used to build holistic platform runtime packages.

(function() {

    const arccore = require("@encapsule/arccore");

    let response = arccore.filter.create({
        operationID: "78JoyQrrR7CZUG0PNqmbJA",
        operationName: "Holistic Platform Package Metadata Filter",
        operationDescription: "Validates/normalizes a small database of metadata for each runtime package in the holistic app platform.",
        outputFilterSpec: {
            ____types: "jsObject",
            ____asMap: true,
            packageNameKey: {
                ____types: "jsObject",
                packageType: {
                    ____accept: "jsString",
                    ____inValueSet: [ "library", "tools" ]
                },
                packageEnvironments: {
                    ____types: "jsArray",
                    supportedEnvironmentFlag: {
                        ____accept: "jsString",
                        ____inValueSet: [ "browser", "node" ]
                    }
                },
                packageManifestOverrides: {
                    ____types: "jsObject",
                    description: { ____accept: "jsString" },
                    keywords: { ____types: "jsArray", keyword: { ____accept: "jsString" } },
                    license: { ____accept: "jsString", ____defaultValue: "MIT" },
                    main: { ____accept: "jsString", ____defaultValue: "index.js" },
                    devDependencies: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        ____asMap: true,
                        packageName: { ____accept: "jsString", ____description: "Semantic version string." }
                    },
                    peerDependencies: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        ____asMap: true,
                        packageName: { ____accept: "jsString", ____description: "Semantic version string." }
                    },
                    bin: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        ____asMap: true,
                        binAliasName: { ____accept: "jsString", ____description: "Command line string." }
                    }
                },
                packageReadme: {
                    ____types: "jsObject",

                    // Distribution package @encapsule/holistic
                    introduction: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                    },

                    distributionPackage: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        prerequisites: {
                            ____types: "jsObject",
                            markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                        },
                        installation: {
                            ____types: "jsObject",
                            markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                        },
                        usage: {
                            ____types: "jsObject",
                            markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                        }
                    },

                    holisticAppPlatform: {
                        ____types: [ "jsObject", "jsUndefined" ],
                        overview: {
                            ____types: "jsObject",
                            markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                        },
                        appgen: {
                            ____types: "jsObject",
                            markdown: { ____types: "jsArray", markdownParagraph: { ____accept: "jsString" } }
                        }
                    },

                    // RTL pseudo package @encapsule/xxxxx
                    bodySections: {
                        ____types: [ "jsArray", "jsUndefined" ],
                        readmeBodySection: {
                            ____types: "jsObject",
                            headerMarkdown: { ____accept: [ "jsString", "jsUndefined" ] },
                            markdown: {
                                ____types: "jsArray",
                                markdownParagraphString: { ____accept: "jsString" }
                            }
                        }
                    } // bodySections

                }

            }
        }
    });

    if (response.error) {
        throw new Error(response.error);
    }

    const packageMetadataFilter = response.result;

    const packages = {
        "@encapsule/holarchy": require("./holarchy"),
        "@encapsule/holarchy-cm": require("./holarchy-cm"),
        "@encapsule/holism": require("./holism"),
        "@encapsule/holism-metadata": require("./holism-metadata"),
        "@encapsule/holism-services": require("./holism-services"),
        "@encapsule/holistic": require("./holistic"),
        "@encapsule/holistic-app-models": require("./holistic-app-models"),
        "@encapsule/holistic-html5-service": require("./holistic-html5-service"),
        "@encapsule/holistic-nodejs-service": require("./holistic-nodejs-service"),
        "@encapsule/holistic-service-core": require("./holistic-service-core"),
        "@encapsule/holodeck": require("./holodeck"),
        "@encapsule/holodeck-assets": require("./holodeck-assets"),
        "@encapsule/hrequest": require("./hrequest"),
        "@encapsule/d2r2" : require("./d2r2"),
        "@encapsule/d2r2-components": require("./d2r2-components")
    };

    response = packageMetadataFilter.request(packages);
    if (response.error) {
        throw new Error(response.error);
    }

    module.exports = response.result;

})();
