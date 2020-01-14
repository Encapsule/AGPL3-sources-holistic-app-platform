
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

module.exports = {

    packageType: "tools",
    packageEnvironment: [ "node" ],
    packageManifestOverrides: {
        description: "Encapsule Project holistic platform RTL's and 'appgen' derived app/service git repo maintainence utility.",
        keywords: [ "encapsule", "holistic" ],
        license: "MIT",
        main: "index.js",
        dependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/arctools": arccore.__meta.version,
            "mkdirp": packageMeta.devDependencies["mkdirp"],
            "semver": packageMeta.devDependencies["semver"]
        },
        bin: {
            appgen: "./appgen.js"
        }
    },
    packageReadme: {
        summaryDescriptor: {
            heading: "@encapsule/holistic",
            markdown: [
            ]
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: [
            ],
            bodySections: []
        }
    }

};