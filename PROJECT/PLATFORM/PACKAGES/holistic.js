
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

module.exports = {

    packageType: "tools",
    packageEnvironment: [ "node" ],
    packageManifestOverrides: {
        description: "Encapsule Project Holistic Application Platorm runtime lirbaries + appgen repo maintenance command line tool.",
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
		"The @encapsule/holistic package contains:\n",
		"- The [appgen](#appgen-utility) command-line utility used to maintain derived app and service git repositories.",
		"- Copies of the [Holistic Platform](#holistic-platform) runtime library packages used by appgen."
	    ]
	},
	usageDescriptor: {
	    // heading: "> usageDescriptor heading",
	    markdown: [
		"This is a line of markdown test in the usageDescriptor.markdown array."
	    ]
	},
	bodySections: [
	    {
		 //heading: "> body section 1 heading",
		markdown: [
		    "This is some general introductory test to the Documentation section."
		]
	    },
	    {
		heading: "### appgen utility",
		markdown: [
		    "This is a line of text about `appgen` utility."
		]
	    }
	]

    }
};
