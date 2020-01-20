// PROJECT/PACKAGES/d2r2-components.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains a collection of re-usable d2r2 React components for use with the d2r2 ComponentRouter dynamic view compositor.",
        keywords: [ "Encapsule", "React", "ComponentRouter", "d2r2" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/d2r2": holisticBuild.version,
            "react": holisticPlatformManifest.platformDependencies["react"],
            "react-dom": holisticPlatformManifest.platformDependencies["react-dom"]
        },
        bin: {
            copy_resources: "./bin/copy_holarchy_resources.js"
        }
    },

    packageReadme: {
	overviewDescriptor: {
            heading: "# overview descriptor header",
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
                "blah blah blah Reusable React components for d2r2."
            ]
        },
        bodySections: [
	    {
		heading: "# WHAT IS IT?",
		markdown: [
		    "This is some text in the body section."
		]
	    }
	]
    }

};
