// PROJECT/PLATFORM/PACKAGES/holarchy.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains the ObservableProcessController (OPC), ObservableProcessModel (OPM), ObservableControllerData (OCD), TransitionOperator (TOP), and ControllerAction (ACT) ES6 classes that are used to define and execute hierarchical asynchronous system models. Used to build complex reactive data-driven UX. And, back-end process orchestration data workflows.",
        keywords: [ "Encapsule", "holistic", "holarchy", "holarchy-sml", "software model", "software library", "SML", "reuse", "re-use", "ObservableProcessController", "ObservableProcessModel", "ObservableControllerData", "TransitionOperator", "ControllerAction" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            heading: undefined,
            markdown: [
		"_Replace with holarchy module overview._"
	    ]
        },
        bodySections: [
	    {
		markdown: [
		    "_Replace with detailed information about the holarchy package._"
		]
	    }
	]
    }
};
