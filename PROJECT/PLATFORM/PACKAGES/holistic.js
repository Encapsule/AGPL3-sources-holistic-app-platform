
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");

const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

let exportObject = {

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
	    markdown: [
		"### Welcome the the Holistic App Platform",
		

		// THIS HAS TO COME LAST IN THE OVERVIEW!
		"### Contents",
		"- [**appgen**](#appgen-utility) - A command-line utility used to initialize & maintain derived app/service git repos.",
		"- [**Holistic Platform Runtime**](#holistic-platform-runtime \"Jump to RTL package index...\") - Core runtime app/service runtime libraries (RTL) packages."
	    ]
	},

	appgenSections: [
	    {
		heading: "#### Overview",
		markdown: [
		    "This will be an explanation of the role of `appgen`."
		]
	    },
	    {
		heading: "#### Usage",
		markdown: [
		    "##### Prerequisites",
		    "worry free. boom.",
		    
		    "##### Initial Project Setup",
		    "sdj s kdjf s dkjhfsd",

		    "##### Project Update",
		    "E E Dksjks l lksdf",

		    "##### Update Verification",
		    "sf l llsdkfj wl kwksxcnsl",

		    "##### Update Commit",
		    "fs j lkclkxs lwpo ns"
		]
	    },
	    {
		heading: "#### Derived Projects",
		markdown: [
		    "Some introductory text.",

		    "##### yarn Integrations",
		    " sdkjfsdfs whole list blah blah",

		    "##### Project Directory Structure",
		    "Some initial discussion of the `appgen`-created directory structure.",

		    "##### Holistic App Build: Makefile",
		    "An explanation of the `appgen`-generated Makefile created in the root of derived projects.",

		    "##### App-Specific Build: Makefile-App",
		    "jdhf  fkjhsdfkj s"
		    
		]
	    }
	],

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

/*
holisticPackages.forEach(function(packageName_) {
    exportObject.packageReadme.overviewDescriptor.markdown.push("    - [" + packageName_ + "](PACKAGES/" + packageName_.split("/")[1] + "/README.md)");
});
*/

module.exports = exportObject;
