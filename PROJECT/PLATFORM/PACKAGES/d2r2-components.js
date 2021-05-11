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
            "react": holisticPlatformManifest.dependencies.common["react"],
            "react-dom": holisticPlatformManifest.dependencies.common["react-dom"]
        },
        bin: {
            copy_resources: "./bin/copy_holarchy_resources.js"
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
