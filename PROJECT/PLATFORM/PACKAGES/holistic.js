
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

module.exports = {

    packageType: "tools",
    packageEnvironment: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains the Holistic App Platform runtime libraries (RTL's) and the 'appgen' utility for initializing and maintaining derived application and service git repositories.",
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
            appgen: "./appgen"
        }
    },
    packageReadme: {
	overviewDescriptor: {
	    // heading: "> overviewDescriptor heading",
	    markdown: [
		"**Welcome the the Holistic App Platform!**",
		"In this document:",
		"- [appgen](#appgen-utility) command-line utility used to maintain derived app and service git repositories.",
		"- [Holistic Platform Runtime](#holistic-platform-runtime) runtime library packages managed by `appgen`."
	    ]
	},
	bodySections: [
	    {
		 //heading: "> body section 1 heading",
		markdown: [
		    "The following sections explains the purpose and use of the [appgen](#appgen-utility) utility. And, provides an overview of the [Holistic Platform Runtime](#holistic-platform-runtime) library pseudo-packages copied by `appgen` into derived application and service git repositories."
		]
	    }
	]

    }
};
