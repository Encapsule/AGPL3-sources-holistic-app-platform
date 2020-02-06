// PROJECT/PLATFORM/PACKAGES/holarchy-sml.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "This package contains the Holistic App Platform's core re-usable Software Model Library (SML) derived from @encapsule/holarchy ObservableProcessModel (OPM), TransitionOperator (TOP), and ControllerAction (ACT). Intended for use in derived app/services in conjunction with application-specific SML's executing in ObservableProcessController (OPC) instance(s).",
        keywords: [ "Encapsule", "holistic", "holarchy", "holarchy-sml", "software model", "software library", "SML", "reuse", "re-use", "ObservableProcessController", "ObservableProcessModel", "ObservableControllerData", "TransitionOperator", "ControllerAction" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "react": react.version,
            "react-dom": react.version
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
